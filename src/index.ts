import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import express from 'express';

import { User } from './entities/User';
import { Game } from './entities/Game';
import { Rating } from './entities/Rating';
import { GameResolver } from './modules/game/GameResolver';
import { UserResolver } from './modules/user/UserResolver';
import { HistoryModel as History } from './entities/History';
import { CalendarModel as Calendar } from './entities/Calendar';

const postgresApp = express();
const mongoApp = express();

const path = '/graphql';

async function bootstrap() {
	try {
		// create TypeORM connection
		await TypeORM.createConnection({
			type: 'postgres',
			url: 'postgres://furrax:furrax@postgres_container/furrax',
			entities: [User, Game, Rating],
			synchronize: true,
			logger: 'advanced-console',
			logging: true,
			dropSchema: true,
			cache: true,
		});

		// build TypeGraphQL executable schema
		const schema = await TypeGraphQL.buildSchema({
			resolvers: [UserResolver, GameResolver],
		});

		// Create GraphQL server
		const server = new ApolloServer({ schema, context: ({ req, res }) => ({ req, res }) });

		server.applyMiddleware({ app: postgresApp, path });

		// start the server
		postgresApp.listen(3000, () => {
			console.log(
				`Server is running, GraphQL Playground available at http://localhost:3000/graphql`
			);
		});
	} catch (err) {
		console.error(err);
	}
}

async function bootstrap2() {
	try {
		// create TypeORM connection
		await TypeORM.createConnection({
			type: 'mongodb',
			url: 'mongodb://furrax:furrax@mongo_container/furrax',
			entities: [History, Calendar],
			synchronize: true,
			logger: 'advanced-console',
			logging: true,
			dropSchema: false,
			cache: true,
		});

		// build TypeGraphQL executable schema
		const schema = await TypeGraphQL.buildSchema({
			resolvers: [UserResolver, GameResolver],
		});

		// create GraphQL server
		const server = new ApolloServer({ schema });

		server.applyMiddleware({ app: mongoApp, path });

		// start the server
		mongoApp.listen(4000, () => {
			console.log(
				`Server is running, GraphQL Playground available at http://localhost:4000/graphql`
			);
		});
	} catch (err) {
		console.error(err);
	}
}

bootstrap();
bootstrap2();
