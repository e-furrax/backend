import * as bcrypt from 'bcryptjs';
import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
    ObjectType,
    Field,
    Authorized,
} from 'type-graphql';
import { Repository, In } from 'typeorm';
import { Service } from 'typedi';
import { sign } from 'jsonwebtoken';

import { MyContext } from '@/types/MyContext';
import { isAuth } from '@/middlewares/isAuth';
import { PostgresService } from '@/services/repositories/postgres-service';
import { User, Status, UserRole } from '@/entities/postgres/User';
import { Language } from '@/entities/postgres/Language';
import { Game } from '@/entities/postgres/Game';
import { LanguagesInput } from '@/modules/postgres/language/LanguagesInput';
import { GamesInput } from '@/modules/postgres/game/GamesInput';
import { UserInput } from './UserInput';
import { PromotionInput } from './PromotionInput';
import { sendEmail } from '@/utils/sendEmail';
import { createConfirmationCode } from '@/utils/createConfirmationCode';
import { redis } from '@/redis';
import { FilterInput } from './FilterInput';
import { RegisterInput } from './register/RegisterInput';
import { Availability } from '@/entities/postgres/Availability';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver(() => User)
@Service()
export class UserResolver {
    private repository: Repository<User>;
    private languageRepository: Repository<Language>;
    private gameRepository: Repository<Language>;
    private availabilityRepository: Repository<Availability>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(User);
        this.languageRepository = this.postgresService.getRepository(Language);
        this.gameRepository = this.postgresService.getRepository(Game);
        this.availabilityRepository =
            this.postgresService.getRepository(Availability);
    }

    @Query(() => [User])
    async getUsers(@Arg('data', { nullable: true }) data?: FilterInput) {
        const usersQuery = await this.repository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.languages', 'languages')
            .leftJoinAndSelect('user.receivedRatings', 'receivedRatings')
            .leftJoinAndSelect('user.games', 'games')
            .where('user.status = :status', { status: Status.VERIFIED });

        if (data && data.languages) {
            usersQuery.andWhere('languages.id IN(:...languagesIds)', {
                languagesIds: data.languages,
            });
        }

        if (data && data.games) {
            usersQuery.andWhere('games.id IN(:...gamesIds)', {
                gamesIds: data.games,
            });
        }

        if (data && data.gender) {
            usersQuery.andWhere('user.gender = :gender ', {
                gender: data.gender,
            });
        }
        return usersQuery.getMany();
    }

    @Query(() => User, { nullable: true })
    async getUser(@Arg('data') data: UserInput) {
        return await this.repository.findOne(
            { ...data },
            {
                relations: [
                    'receivedRatings',
                    'givenRatings',
                    'receivedRatings.fromUser',
                    'givenRatings.toUser',
                    'languages',
                    'games',
                ],
            }
        );
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    async me(@Ctx() { payload }: MyContext): Promise<User> {
        const user = await this.repository.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }

        return user;
    }

    @Mutation(() => User)
    async register(
        @Arg('data') { email, password, username, gender }: RegisterInput
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const availability = new Availability();
        await this.availabilityRepository.save(availability);

        const user = this.repository.create({
            username,
            email,
            password: hashedPassword,
            gender,
            availability,
        });

        await this.repository.save(user);
        await sendEmail(email, await createConfirmationCode(user.id));
        return user;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<any> {
        const user = await this.repository.findOne({ where: { email } });

        if (!user) {
            throw new Error('Could not find user');
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            throw new Error('Wrong password');
        }

        if (user.status !== Status.VERIFIED) {
            throw new Error('Registration incomplete');
        }

        return {
            accessToken: sign(
                { userId: user.id, role: user.role },
                's3cr3tk3y',
                {
                    expiresIn: '1y',
                }
            ),
        };
    }

    @Mutation(() => LoginResponse)
    async confirmUser(@Arg('code') code: string): Promise<LoginResponse> {
        const userId = await redis.get(code);

        if (!userId) {
            throw new Error("This code isn't valid");
        }

        const user = await this.repository.findOne(+userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.status = Status.VERIFIED;
        await this.repository.save(user);

        await redis.del(code);

        return {
            accessToken: sign({ userId, role: user.role }, 's3cr3tk3y', {
                expiresIn: '1y',
            }),
        };
    }

    @Mutation(() => Boolean)
    async generateVerificationCode(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<boolean> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Could not find user');
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return false;
        }

        await sendEmail(email, await createConfirmationCode(user.id));

        return true;
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async addLanguages(
        @Ctx() { payload }: MyContext,
        @Arg('languages') languages: LanguagesInput
    ): Promise<User> {
        const user = await this.repository.findOne({
            where: {
                id: payload?.userId,
            },
            relations: ['languages'],
        });
        if (!user) {
            throw new Error('Could not find user');
        }

        const languagesFound = await this.languageRepository.find({
            where: {
                id: In(languages.ids),
            },
        });

        if (!languagesFound.length) {
            throw new Error('Could not find languages');
        }

        user.languages = [...user.languages, ...languagesFound];

        await this.repository.save(user);

        return user;
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async addGames(
        @Ctx() { payload }: MyContext,
        @Arg('games') games: GamesInput
    ): Promise<User> {
        const user = await this.repository.findOne({
            where: {
                id: payload?.userId,
            },
            relations: ['games'],
        });

        if (!user) {
            throw new Error('Could not find user');
        }

        const gamesFound = await this.gameRepository.find({
            where: {
                id: In(games.ids),
            },
        });

        if (!gamesFound.length) {
            throw new Error('Could not find games');
        }

        user.games = [...user.games, ...gamesFound];

        await this.repository.save(user);

        return user;
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async updateRole(
        @Ctx() { payload: currentUser }: MyContext,
        @Arg('promotion') { id, role }: PromotionInput
    ): Promise<User> {
        const user = (await this.repository.findOne({ id })) as User;
        if (
            currentUser?.role === UserRole.MODERATOR &&
            (user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN)
        ) {
            throw new Error(
                'Access denied! Action not permitted for this user'
            );
        }
        if (
            currentUser?.role === UserRole.MODERATOR &&
            (role === UserRole.MODERATOR || role === UserRole.ADMIN)
        ) {
            throw new Error(
                "Access denied! You don't have permission for this action!"
            );
        }
        user.role = role;
        return this.repository.save(user);
    }
}
