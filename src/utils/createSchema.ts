import { GameResolver } from '../modules/game/GameResolver';
import { SearchResolver } from '../modules/search/SearchResolver';
import { UserResolver } from '../modules/user/UserResolver';
import { buildSchema } from 'type-graphql';
import { ProfileResolver } from '../modules/user/ProfileResolver';

export const createSchema = () =>
    buildSchema({
        resolvers: [
            UserResolver,
            GameResolver,
            SearchResolver,
            ProfileResolver,
        ],
    });
