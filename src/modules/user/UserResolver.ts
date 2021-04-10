import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
    ObjectType,
    Field,
} from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { Status, User } from '../../entities/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../../middlewares/isAuth';
import { MyContext } from '../../types/MyContext';
import { sign } from 'jsonwebtoken';
import { UserInput } from './UserInput';
import { sendEmail } from '../../utils/sendEmail';
import { createConfirmationUrl } from '../../utils/createConfirmationUrl';
import { redis } from '../../redis';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async getUsers() {
        return await User.find();
    }

    @Query(() => User, { nullable: true })
    async getUser(@Arg('data') data: UserInput) {
        return await User.findOne({ ...data });
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    async me(@Ctx() { payload }: MyContext) {
        return `Your user id : ${payload?.userId}`;
    }

    @Mutation(() => User)
    async register(
        @Arg('data') { email, password, username }: RegisterInput
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        }).save();

        await sendEmail(email, await createConfirmationUrl(user.id));
        return user;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<any> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Could not find user');
        }

        const verify = await bcrypt.compare(password, user.password);

        if (!verify) {
            throw new Error('Wrong password');
        }

        if (user.status < Status.Verified) {
            throw new Error('Registration incomplete');
        }

        return {
            accessToken: sign({ userId: user.id }, 's3cr3tk3y', {
                expiresIn: '15m',
            }),
        };
    }

    @Mutation(() => Boolean)
    async confirmUser(@Arg('token') token: string): Promise<boolean> {
        const userId = await redis.get(token);

        if (!userId) {
            return false;
        }

        await User.update({ id: +userId }, { status: Status.Verified });
        await redis.del(token);

        return true;
    }
}
