import { User } from '@/entities/postgres/User';

export interface RatingNotification {
    comments: string;
    rating: string;
    toUser: User;
    createdAt: string;
}
