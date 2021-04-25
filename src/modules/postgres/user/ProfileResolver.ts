import * as bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { PostgresService } from '@/services/postgres-service';

import { MyContext } from '@/types/MyContext';
import { avatarUploader } from '@/libs/gql-uploaders';
import { isAuth } from '@/middlewares/isAuth';
import { User } from '@/entities/postgres/User';
import { UpdateProfileInput } from './ProfileInput';

@Service()
@Resolver(() => User)
export class ProfileResolver {
    private repository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(User);
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    async getProfile(@Ctx() { payload }: MyContext): Promise<User | undefined> {
        return await this.repository.findOne(payload?.userId);
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async updateProfile(
        @Ctx() { payload }: MyContext,
        @Arg('data') data: UpdateProfileInput
    ): Promise<User> {
        const user = await this.repository.findOne(payload?.userId);
        if (!user) {
            throw new Error("Your profile couldn't be found");
        }
        Object.assign(user, data);
        return this.repository.save(user);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updatePassword(
        @Ctx() { payload }: MyContext,
        @Arg('initialPassword') initialPassword: string,
        @Arg('newPassword') newPassword: string
    ): Promise<boolean> {
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        const user = await this.repository.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }

        const verify = await bcrypt.compare(initialPassword, user.password);

        if (!verify) {
            throw new Error('Your initial password is wrong');
        }

        user.password = hashedNewPassword;

        await this.repository.save(user);

        return true;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updateProfilePic(
        @Ctx() { payload }: MyContext,
        @Arg('picture', () => GraphQLUpload)
        { createReadStream, filename, mimetype }: FileUpload
    ): Promise<boolean> {
        const user = await this.repository.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }

        const uri = await avatarUploader.upload(createReadStream(), {
            filename,
            mimetype,
        });

        user.profileImage = uri;
        await this.repository.save(user);

        return true;
    }
}
