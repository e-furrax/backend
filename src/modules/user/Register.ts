import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/User';

@Resolver()
export class RegisterResolver {
	@Query(() => String)
	async hello() {
		return 'hello world';
	}

	@Mutation(() => User)
	async register(
		@Arg('username') username: string,
		@Arg('email') email: string,
		@Arg('password') password: string
	): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		}).save();

		return user;
	}
}
