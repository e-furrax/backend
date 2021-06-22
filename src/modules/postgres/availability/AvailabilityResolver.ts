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
import { UserInput } from './../user/UserInput';

@Resolver(() => Availability)
@Service()
export class AvailabilityResolver {
    private repository: Repository<Availability>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Availability);
    }

    @Mutation(() => Availability)
    @UseMiddleware(isAuth)
    async updateAvailability(
        @Ctx() { payload }: MyContext,
        @Arg('value') value: string
    ): Promise<Availability> {
        const availability = await this.repository.findOne({
            where: {
                user: payload?.userId,
            },
        });
        if (!availability) {
            throw new Error('Could not find availability');
        }

        availability.value = value;
        await this.repository.save(availability);

        return availability;
    }

    @Query(() => Availability)
    async getAvailability(@Arg('user') user: UserInput) {
        return await this.repository.findOne({
            where: {
                user,
            },
        });
    }
}
