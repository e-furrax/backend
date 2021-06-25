import { Game } from '@/entities/postgres/Game';
import { Repository } from 'typeorm';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { InsertGameInput } from './InsertGameInput';

import { Service } from 'typedi';
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
    async createGame(@Arg('data') data: InsertGameInput): Promise<Game> {
        const game = await this.repository
            .create({
                ...data,
            })
            .save();

        return game;
    }

    @Mutation(() => Boolean)
    async deleteGame(@Arg('id') id: number): Promise<boolean> {
        const game = await this.repository.findOne(id);
        if (!game) {
            throw new Error(`Game "${id}" not found.`);
        }
        await this.repository.remove(game);

        return true;
    }

    @Mutation(() => Game)
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
