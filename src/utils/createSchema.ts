import { PostgresResolvers } from '@/modules';
import { buildSchema } from 'type-graphql';

export const createSchema = () =>
    buildSchema({
        resolvers: PostgresResolvers,
    });
