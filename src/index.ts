import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import express from 'express';

import { GameResolver } from './resolvers/game-resolver';
import { RateResolver } from './resolvers/rate-resolver';
// import { Game } from './entities/game';
// import { Rate } from './entities/rate';
import { User } from './entities/user';

export interface Context {
	user: User;
}

// register 3rd party IOC container
TypeORM.useContainer(Container);

const app = express();
const path = '/graphql';

async function bootstrap() {
	try {
		// create TypeORM connection
		await TypeORM.createConnection({
			type: 'postgres',
			url: 'postgres://furrax:furrax@postgres_container/furrax',
		})
			.then((res) => console.log(res))
			.catch((err) => console.log(err));

		// build TypeGraphQL executable schema
		const schema = await TypeGraphQL.buildSchema({
			resolvers: [GameResolver, RateResolver],
			container: Container,
		});

		// Create GraphQL server
		const server = new ApolloServer({ schema });

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
