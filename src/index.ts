import 'module-alias/register';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import express from 'express';
import { Container } from 'typedi';

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
        });

        postgresApp.use(
            '/graphql',
            graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
        );

        server.applyMiddleware({ app: postgresApp, path: GQLpath });

        postgresApp.listen(3000, () => {
            console.log(
                'Server is running, GraphQL Playground available at http://localhost:3000/graphql'
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
                'Server is running, GraphQL Playground available at http://localhost:4000/graphql'
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
