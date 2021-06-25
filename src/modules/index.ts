import { LanguageResolver } from './postgres/language/LanguageResolver';
import { GameResolver } from './postgres/game/GameResolver';
import { UserResolver } from './postgres/user/UserResolver';
import { ProfileResolver } from './postgres/user/ProfileResolver';
import { SearchResolver } from './postgres/search/SearchResolver';
import { RatingResolver } from './postgres/rating/RatingResolver';

import { AppointmentResolver } from './mongo/appointment/AppointmentResolver';

export const PostgresResolvers = [
    UserResolver,
    GameResolver,
    LanguageResolver,
    SearchResolver,
    ProfileResolver,
    RatingResolver,
] as const;
export const MongoResolvers = [AppointmentResolver] as const;
