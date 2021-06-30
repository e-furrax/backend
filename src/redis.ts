import Redis from 'ioredis';

export const redis = new Redis({
    host: process.env.REDIS_ENDPOINT || 'redis_container',
    port: 6379,
    ...(process.env.REDIS_PASSWORD
        ? { password: process.env.REDIS_PASSWORD }
        : undefined),
});
