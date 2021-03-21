import { Game } from '../../../entities/postgres/Game';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { InsertGameInput } from './InsertGameInput';

@Resolver()
export class GameResolver {
    @Query(() => [Game])
    async getGames() {
        return await Game.find();
    }

    @Mutation(() => Game)
    async createGame(@Arg('data') data: InsertGameInput): Promise<Game> {
        const game = await Game.create({
            ...data,
        }).save();

        return game;
    }

    @Mutation(() => Boolean)
    async deleteGame(@Arg('id') id: string): Promise<boolean> {
        const game = await Game.findOne({ where: { id } });
        if (!game) {
            throw new Error(`The game with id : ${id} does not exist`);
        }
        await game.remove();

        return true;
    }

    @Mutation(() => Game)
    async updateGame(
        @Arg('id') id: string,
        @Arg('data') data: InsertGameInput
    ) {
        const game = await Game.findOne({ where: { id } });
        if (!game) {
            throw new Error(`The game with id: ${id} does not exist`);
        }
        Object.assign(game, data);
        await game.save();

        return game;
    }
}
