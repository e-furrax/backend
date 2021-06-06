import { Game } from '../../entities/Game';
import { User } from '../../entities/postgres/User';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class UserAndGames {
    @Field(() => [User])
    users: User[];

    @Field(() => [Game])
    games: Game[];
}

@Resolver()
export class SearchResolver {
    @Query(() => UserAndGames)
    async SearchByUsernameOrGamename(@Arg('input') input: string) {
        const users = await User.createQueryBuilder()
            .select()
            .where('username ILIKE :searchTerm', { searchTerm: `%${input}%` })
            .getMany();
        const games = await Game.createQueryBuilder()
            .select()
            .where('name ILIKE :searchTerm', { searchTerm: `%${input}%` })
            .getMany();

        return {
            users,
            games,
        };
    }
}
