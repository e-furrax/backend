import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
    ObjectType,
    Field,
} from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '@/entities/postgres/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '@/middlewares/isAuth';
import { MyContext } from '@/types/MyContext';
import { sign } from 'jsonwebtoken';
import { UserInput } from './UserInput';
import { PostgresService } from '@/services/postgres-service';
import { Repository } from 'typeorm';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver(() => User)
export class UserResolver {
    private repository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(User);
    }

    @Query(() => [User])
    async getUsers() {
        return await this.repository.find();
    }

    @Query(() => User, { nullable: true })
    async getUser(@Arg('data') data: UserInput) {
        return await this.repository.findOne({ ...data });
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    async me(@Ctx() { payload }: MyContext) {
        return `Your user id : ${payload?.userId}`;
    }

    @Mutation(() => User)
    async register(
        @Arg('data') { email, password, username }: RegisterInput
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.repository
            .create({
                username,
                email,
                password: hashedPassword,
            })
            .save();

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

        return {
            accessToken: sign({ userId: user.id }, 's3cr3tk3y', {
                expiresIn: '15m',
            }),
        };
    }
}