import 'module-alias/register';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import express from 'express';
import session from 'express-session';
import { redis } from './redis';
import connectRedis from 'connect-redis';
// import cors from 'cors';
import { Container } from 'typedi';
import http from 'http';

import { graphqlUploadExpress } from 'graphql-upload';
import { loadFixtures } from '@/utils/loadFixtures';
import { MongoResolvers, PostgresResolvers } from '@/modules';

const postgresApp = express();
const mongoApp = express();

const GQLpath = '/graphql';

async function bootstrapPg() {
    try {
        const connection = await TypeORM.createConnection('postgres');
        Container.set('POSTGRES_MANAGER', connection);

        const schema = await TypeGraphQL.buildSchema({
            resolvers: PostgresResolvers,
            container: Container,
        });

        await loadFixtures(connection);
        const server = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
            uploads: false,
            subscriptions: {
                onConnect: () => console.log('Connected to websocket'),
            },
        });

        postgresApp.use(
            '/graphql',
            graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
        );

        // postgresApp.use(
        //     cors({
        //         credentials: true,
        //         origin: 'http://localhost:3000',
        //     })
        // );

        const RedisStore = connectRedis(session);

        postgresApp.use(
            session({
                store: new RedisStore({
                    client: redis,
                }),
                name: 'qid',
                secret: 'aslkdfjoiq12312',
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
                },
            })
        );

        server.applyMiddleware({ app: postgresApp, path: GQLpath });

        const httpServer = http.createServer(postgresApp);
        server.installSubscriptionHandlers(httpServer);

        httpServer.listen(3000, () => {
            console.log(
                'Postgres Server is running, GraphQL Playground available at http://localhost:3000/graphql'
            );
        });
    } catch (err) {
        console.error(err);
    }
}

async function bootstrapMongo() {
    try {
        const connection = await TypeORM.createConnection('mongodb');
        Container.set('MONGO_MANAGER', connection);

        const schema = await TypeGraphQL.buildSchema({
            resolvers: MongoResolvers,
            container: Container,
        });

        const server = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
        });

        server.applyMiddleware({ app: mongoApp, path: GQLpath });

        mongoApp.listen(4000, () => {
            console.log(
                'Mongo Server is running, GraphQL Playground available at http://localhost:4000/graphql'
            );
        });
    } catch (err) {
        console.error(err);
    }
}

bootstrapPg().catch((err) => {
    console.log(err);
});

bootstrapMongo().catch((err) => {
    console.log(err);
});
