import { GameResolver } from './postgres/game/GameResolver';
import { UserResolver } from './postgres/user/UserResolver';
import { ProfileResolver } from './postgres/user/ProfileResolver';
import { SearchResolver } from './postgres/search/SearchResolver';

import { AppointmentResolver } from './mongo/appointment/AppointmentResolver';

export const PostgresResolvers = [
    UserResolver,
    GameResolver,
    SearchResolver,
    ProfileResolver,
] as const;
export const MongoResolvers = [AppointmentResolver] as const;