import { User } from './postgres/User';
import { Game } from './postgres/Game';
import { Rating } from './postgres/Rating';

import { Appointment } from './mongo/Appointment';
import { Calendar } from './mongo/Calendar';
import { Transaction } from './mongo/Transaction';

export const PostgresModels = [User, Game, Rating];
export const MongoModels = [Appointment, Calendar, Transaction];
