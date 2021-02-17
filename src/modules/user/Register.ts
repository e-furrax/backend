import { Resolver, Query, Mutation, Arg, Args } from 'type-graphql';

@Resolver()
export class RegisterResolver {
	@Query(() => String)
	async hello() {
		return 'hello world';
	}
}
