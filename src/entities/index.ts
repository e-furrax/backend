import { User } from './postgres/User';
import { Game } from './postgres/Game';
import { Message } from './postgres/Message';
import { Availability } from './postgres/Availability';
import { Rating } from './postgres/Rating';

import { Appointment } from './mongo/Appointment';
import { Transaction } from './mongo/Transaction';

export const PostgresModels = [Message, Availability, User, Game, Rating];
export const MongoModels = [Appointment, Transaction];
