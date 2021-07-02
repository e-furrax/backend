import {
    Resolver,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Authorized,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { isAuth } from '@/middlewares/isAuth';
import { MyContext } from '@/types/MyContext';
import { PostgresService } from '@/services/repositories/postgres-service';
import { UserRole } from '@/entities/postgres/User';
import { Statistic } from '@/entities/postgres/Statistic';
import { StatisticInput } from './StatisticInput';

@Resolver(() => Statistic)
@Service()
export class StatisticResolver {
    private repository: Repository<Statistic>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Statistic);
    }

    @Mutation(() => Statistic)
    @UseMiddleware(isAuth)
    async upsertStatistic(
        @Ctx() { payload }: MyContext,
        @Arg('data') { id, mode, game, rank, playerId }: StatisticInput
    ): Promise<Statistic> {
        if (id) {
            return await this.repository.save({
                id,
                mode,
                game,
                rank,
                playerId,
            });
        }

        const newStatistic = await this.repository.create({
            mode,
            rank,
            user: { id: payload?.userId },
            game,
            playerId,
        });

        return await this.repository.save(newStatistic);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    @Authorized([
        UserRole.ADMIN,
        UserRole.MODERATOR,
        UserRole.FURRAX,
        UserRole.USER,
    ])
    async deleteStatistic(
        @Ctx() { payload }: MyContext,
        @Arg('id') id: number
    ): Promise<boolean> {
        const statistic = await this.repository.findOne(id, {
            relations: ['user'],
        });
        if (!statistic) {
            throw new Error('Statistic not found');
        }

        if (
            payload?.userId !== statistic.user.id &&
            statistic.user.role === UserRole.FURRAX
        ) {
            throw new Error("You're not the owner of the statistic!");
        }

        await this.repository.delete(id);
        return true;
    }
}
