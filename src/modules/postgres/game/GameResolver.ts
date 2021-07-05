import { Game } from '@/entities/postgres/Game';
import { Repository } from 'typeorm';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { InsertGameInput } from './InsertGameInput';

import { Service } from 'typedi';
import { UserRole } from '@/entities/postgres/User';
@Service()
@Resolver()
export class GameResolver {
    private repository: Repository<Game>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Game);
    }

    @Query(() => [Game])
    async getGames() {
        return await this.repository.find();
    }

    @Mutation(() => Game)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async createGame(@Arg('data') data: InsertGameInput): Promise<Game> {
        const game = await this.repository
            .create({
                ...data,
            })
            .save();

        return game;
    }

    @Mutation(() => Boolean)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async deleteGame(@Arg('id') id: number): Promise<boolean> {
        const game = await this.repository.findOne(id);
        if (!game) {
            throw new Error(`Game "${id}" not found.`);
        }
        await this.repository.remove(game);

        return true;
    }

    @Mutation(() => Game)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async updateGame(
        @Arg('id') id: number,
        @Arg('data') data: InsertGameInput
    ) {
        const game = await this.repository.findOne(id);
        if (!game) {
            throw new Error(`Game "${id}" not found.`);
        }
        Object.assign(game, data);
        await this.repository.save(game);

        return game;
    }
}
