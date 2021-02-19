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
import {User} from '../../entities/User';
import {RegisterInput} from './register/RegisterInput';
import {isAuth} from '../../middlewares/isAuth';
import {MyContext} from 'src/MyContext';
import {sign} from 'jsonwebtoken';
import {UserInput} from "./UserInput";
import {UserFilterInput} from "./UserFilterInput";

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

    @Query(() => [User], {nullable: true})
    async filterUsers(@Arg('data') data: UserFilterInput) {
        const users = await User.find();
        users.filter(user => {
            user.reload();
            const games = user.games;
            const languages = user.languages;
            if(data.languageCode !== "" && languages !== undefined)
                languages.filter(lng => lng.code === data.languageCode);
            if(data.gameId && games !== undefined)
                games.filter(game => game.id === data.gameId);

            if (data.gameId !== null && data.languageCode !== "") {
                return games.length !== 0 && languages.length !== 0;
            }
            if (data.gameId !== null && data.languageCode === ""){
                return languages.length !== 0;
            }
            if (data.gameId === null && data.languageCode !== ""){
                return games.length !== 0;
            }
           return true
        })
        return users;
    }

    @Query(() => User, {nullable: true})
    async getUser(@Arg('id') data: UserInput) {
        return await User.findOne({...data});
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    async me(@Ctx() {payload}: MyContext) {
        return `Your user id : ${payload?.userId}`;
    }

    @Mutation(() => User)
    async register(@Arg('data') {email, password, username}: RegisterInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        }).save();

        return user;
    }

    @Mutation(() => LoginResponse)
    async login(@Arg('email') email: string, @Arg('password') password: string): Promise<any> {
        const user = await User.findOne({where: {email}});

        if (!user) {
            throw new Error('Could not find user');
        }

        const verify = bcrypt.compare(password, user.password);

        if (!verify) {
            throw new Error('Wrong password');
        }

        return {
            accessToken: sign({userId: user.id}, 's3cr3tk3y', {expiresIn: '15m'}),
        };
    }
}
