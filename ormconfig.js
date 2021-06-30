module.exports = [
    {
        name: 'postgres',
        type: 'postgres',
        url: process.env.POSTGRES_DATABASE_URL || 'postgres://furrax:furrax@postgres_container/furrax',
        entities: ['dist/entities/postgres/*.js'],
        synchronize: true,
        logger: 'advanced-console',
        logging: false,
        dropSchema: true
    },
    {
        name: 'mongodb',
        type: 'mongodb',
        entities: ['dist/entities/mongo/*.js'],
        url: process.env.MONGO_DATABASE_URL || 'mongodb://furrax:furrax@mongo_container:27017/furrax',
        authSource: 'furrax',
        logger: 'advanced-console',
        logging: true,
        useUnifiedTopology: true
    }
];
