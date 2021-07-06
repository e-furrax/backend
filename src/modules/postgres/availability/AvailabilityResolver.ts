import {
    Resolver,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Query,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { isAuth } from '@/middlewares/isAuth';
import { MyContext } from '@/types/MyContext';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Availability } from '@/entities/postgres/Availability';
import { User } from '@/entities/postgres/User';
import { UserInput } from './../user/UserInput';

@Resolver(() => Availability)
@Service()
export class AvailabilityResolver {
    private repository: Repository<Availability>;
    private userRepository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Availability);
        this.userRepository = this.postgresService.getRepository(User);
    }

    @Mutation(() => Availability)
    @UseMiddleware(isAuth)
    async updateAvailability(
        @Ctx() { payload }: MyContext,
        @Arg('value') value: string
    ): Promise<Availability> {
        const user = await this.userRepository.findOne({
            where: {
                id: payload?.userId,
            },
            relations: ['availability'],
        });
        if (!user) {
            throw new Error('Could not found user');
        }

        if (user.id != payload?.userId) {
            throw new Error('Not authorized');
        }

        user.availability.value = value;
        await this.repository.save(user.availability);

        return user.availability;
    }

    @Query(() => Availability)
    async getAvailability(@Arg('user') user: UserInput) {
        const userFound = await this.userRepository.findOne({
            where: {
                id: user.id,
            },
            relations: ['availability'],
        });

        if (!userFound) {
            throw new Error('User not found');
        }

        return userFound.availability;
    }
}
