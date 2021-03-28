import { User } from '../../entities/User';
import { isAuth } from '../../middlewares/isAuth';
import { MyContext } from '../../types/MyContext';
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { UpdateProfileInput } from './ProfileInput';
import * as bcrypt from 'bcryptjs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { avatarUploader } from '../../uploaders';

@ObjectType()
class ProfilePicResponse {
    @Field()
    filename: string;
    @Field()
    mimetype: string;
    @Field()
    encoding: string;
    @Field()
    uri: string;
}

@Resolver()
export class ProfileResolver {
    @Query(() => User)
    @UseMiddleware(isAuth)
    async getProfile(@Ctx() { payload }: MyContext): Promise<User | undefined> {
        return await User.findOne(payload?.userId);
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async updateProfile(
        @Ctx() { payload }: MyContext,
        @Arg('data') data: UpdateProfileInput
    ): Promise<User> {
        const user = await User.findOne(payload?.userId);
        if (!user) {
            throw new Error("Your profile couldn't be found");
        }
        Object.assign(user, data);
        await user.save();

        return user;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updatePassword(
        @Ctx() { payload }: MyContext,
        @Arg('initialPassword') initialPassword: string,
        @Arg('newPassword') newPassword: string
    ): Promise<boolean> {
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        const user = await User.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }

        const verify = await bcrypt.compare(initialPassword, user.password);

        if (!verify) {
            throw new Error('Your initial password is wrong');
        }

        user.password = hashedNewPassword;

        await user.save();

        return true;
    }

    @Mutation(() => ProfilePicResponse)
    @UseMiddleware(isAuth)
    async updateProfilePic(
        @Ctx() { payload }: MyContext,
        @Arg('picture', () => GraphQLUpload)
        { createReadStream, filename, mimetype, encoding }: FileUpload
    ): Promise<ProfilePicResponse> {
        console.log('filename', filename);
        const user = await User.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }

        const uri = await avatarUploader.upload(createReadStream(), {
            filename,
            mimetype,
        });

        return {
            filename,
            mimetype,
            encoding,
            uri,
        };

        // return new Promise((resolve, reject) => {
        //     createReadStream()
        //         .pipe(
        //             createWriteStream(
        //                 __dirname + `/../../../tmp/images/${filename}`
        //             )
        //         )
        //         .on('finish', () => resolve(true))
        //         .on('error', () => reject(false));
        // });
    }
}
