import { GameResolver } from './postgres/game/GameResolver';
import { UserResolver } from './postgres/user/UserResolver';
import { ProfileResolver } from '../modules/user/ProfileResolver';
import { SearchResolver } from './postgres/search/SearchResolver';

import { CalendarResolver } from './mongo/calendar/CalendarResolver';
import { TransactionResolver } from './mongo/transaction/TransactionResolver';

export const PostgresResolvers = [UserResolver, GameResolver, SearchResolver, ProfileResolver] as const;
export const MongoResolvers = [CalendarResolver, TransactionResolver] as const;
