import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { connect } from 'mongoose';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import express from 'express';
import * as path from 'path';

import { User } from './entities/User';
import { Game } from './entities/Game';
import { Rating } from './entities/Rating';
import { CalendarResolver } from './modules/calendar/CalendarResolver';
import {
    Builder,
    fixturesIterator,
    Loader,
    Parser,
    Resolver,
} from 'typeorm-fixtures-cli/dist';
import { createSchema } from './utils/createSchema';
import { graphqlUploadExpress } from 'graphql-upload';

const postgresApp = express();
const mongoApp = express();

const GQLpath = '/graphql';

async function bootstrap() {
    try {
        const connection = await TypeORM.createConnection({
            type: 'postgres',
            url: 'postgres://furrax:furrax@postgres_container/furrax',
            entities: [User, Game, Rating],
            synchronize: true,
            logger: 'advanced-console',
            logging: true,
            dropSchema: true,
            cache: true,
        });

        const loader = new Loader();
        loader.load(path.resolve('./src/fixtures'));

        const resolver = new Resolver();
        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new Builder(connection, new Parser());

        for (const fixture of fixturesIterator(fixtures)) {
            const entity = await builder.build(fixture);
            await TypeORM.getRepository(entity.constructor.name).save(entity);
        }

        const schema = await createSchema();

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

async function bootstrap2() {
    try {
        await connect('mongodb://furrax:furrax@mongo_container/furrax');
        // await mongoose.connection.db.dropDatabase();

        const schema = await TypeGraphQL.buildSchema({
            resolvers: [CalendarResolver],
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

bootstrap()
    .then(() => {
        console.log('\x1b[32m%s\x1b[0m', 'Fixtures are successfully loaded.');
    })
    .catch((err) => {
        console.log(err);
    });
bootstrap2();
