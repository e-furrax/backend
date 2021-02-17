import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import express from 'express';

import { UserResolver } from './modules/user/User';
import { User } from './entities/User';
import { Game } from './entities/Game';
import { Rating } from './entities/Rating';

const app = express();
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
			resolvers: [UserResolver],
		});

		// Create GraphQL server
		const server = new ApolloServer({ schema, context: ({ req, res }) => ({ req, res }) });

		server.applyMiddleware({ app, path });

		// Start the server
		app.listen(3000, () => {
			console.log(
				`Server is running, GraphQL Playground available at http://localhost:3000/graphql`
			);
		});
	} catch (err) {
		console.error(err);
	}
}

bootstrap();
