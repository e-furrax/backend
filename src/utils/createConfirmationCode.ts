import { redis } from '../redis';

export const createConfirmationCode = async (
    userId: number
): Promise<string> => {
    const code = Math.floor(Math.random() * 89999 + 10000).toString();
    await redis.set(code, userId, 'ex', 60 * 3); // 3 min expiration
    return code;
};
