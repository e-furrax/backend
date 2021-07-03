import { resetPasswordPrefix } from '@/constants/redisPrefixes';
import { v4 as uuid } from 'uuid';
import { redis } from '../redis';

export const createResetPasswordUrl = async (
    userId: number
): Promise<string> => {
    const token = uuid();
    await redis.set(resetPasswordPrefix + token, userId, 'ex', 60 * 60 * 24); // 1 day expiration;
    return `http://localhost:8001/reset-password/${token}`;
};
