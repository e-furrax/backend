import { Game } from '@/entities/postgres/Game';
import { User } from '@/entities/postgres/User';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Service } from 'typedi';

@ObjectType()
class UserAndGames {
    @Field(() => [User])
    users: User[];

    @Field(() => [Game])
    games: Game[];
}

@Service()
@Resolver()
export class SearchResolver {
    private gameRepository: Repository<Game>;
    private userRepository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.gameRepository = this.postgresService.getRepository(Game);
        this.userRepository = this.postgresService.getRepository(User);
    }
    @Query(() => UserAndGames)
    async SearchByUsernameOrGamename(@Arg('input') input: string) {
        const users = await this.userRepository
            .createQueryBuilder()
            .select()
            .where('username ILIKE :searchTerm', { searchTerm: `%${input}%` })
            .getMany();
        const games = await this.gameRepository
            .createQueryBuilder()
            .select()
            .where('name ILIKE :searchTerm', { searchTerm: `%${input}%` })
            .getMany();

        return {
            users,
            games,
        };
    }
}
