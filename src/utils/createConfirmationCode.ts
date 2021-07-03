import { confirmationPrefix } from '@/constants/redisPrefixes';
import { redis } from '../redis';

export const createConfirmationCode = async (
    userId: number
): Promise<string> => {
    const code = Math.floor(Math.random() * 89999 + 10000).toString();
    await redis.set(confirmationPrefix + code, userId, 'ex', 60 * 60 * 24); // 1 day expiration
    return code;
};
