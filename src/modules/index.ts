import { LanguageResolver } from './postgres/language/LanguageResolver';
import { GameResolver } from './postgres/game/GameResolver';
import { UserResolver } from './postgres/user/UserResolver';
import { ProfileResolver } from './postgres/user/ProfileResolver';
import { PromotionDemandResolver } from './postgres/user/PromotionDemandResolver';
import { SearchResolver } from './postgres/search/SearchResolver';
import { RatingResolver } from './postgres/rating/RatingResolver';
import { MessageResolver } from './postgres/message/MessageResolver';
import { AvailabilityResolver } from './postgres/availability/AvailabilityResolver';
import { StatisticResolver } from './postgres/statistic/StatisticResolver';

import { AppointmentResolver } from './mongo/appointment/AppointmentResolver';

export const PostgresResolvers = [
    UserResolver,
    GameResolver,
    LanguageResolver,
    PromotionDemandResolver,
    SearchResolver,
    ProfileResolver,
    RatingResolver,
    MessageResolver,
    AvailabilityResolver,
    StatisticResolver,
] as const;
export const MongoResolvers = [AppointmentResolver] as const;
