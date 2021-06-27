import {
    Resolver,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Query,
    Subscription,
    Root,
    PubSub,
    PubSubEngine,
    Authorized,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { isAuth } from '@/middlewares/isAuth';
import { MyContext } from '@/types/MyContext';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Message } from '@/entities/postgres/Message';
import { User } from '@/entities/postgres/User';
import { MessageInput } from './MessageInput';
import { UserInput } from './../user/UserInput';
import { ConversationsObject } from './ConversationsObject';

@Resolver(() => Message)
@Service()
export class MessageResolver {
    private repository: Repository<Message>;
    private userRepository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Message);
        this.userRepository = this.postgresService.getRepository(User);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async sendMessage(
        @Ctx() { payload }: MyContext,
        @Arg('data') { content, toUser }: MessageInput,
        @PubSub() pubSub: PubSubEngine
    ): Promise<boolean> {
        const fromUser = await this.userRepository.findOne(payload?.userId);
        if (!fromUser) {
            throw new Error('Could not find fromUser');
        }

        const toUserFound = await this.userRepository.findOne(toUser.id);
        if (!toUserFound) {
            throw new Error('Could not find toUser');
        }

        const newMessage = await this.repository.create({
            content,
            fromUser: {
                id: fromUser.id,
                username: fromUser.username,
            },
            toUser: {
                id: toUserFound.id,
                username: toUserFound.username,
            },
        });

        await this.repository.save(newMessage);

        await pubSub.publish('NEW_MESSAGE', newMessage);

        return true;
    }

    @Query(() => [Message])
    @UseMiddleware(isAuth)
    async getConversation(
        @Ctx() { payload }: MyContext,
        @Arg('toUser') toUser: UserInput
    ) {
        return await this.repository.find({
            where: {
                fromUser: payload?.userId,
                toUser,
            },
            relations: ['fromUser', 'toUser'],
        });
    }

    @Query(() => [ConversationsObject])
    @UseMiddleware(isAuth)
    async getConversations(
        @Ctx() { payload }: MyContext
    ): Promise<ConversationsObject[]> {
        return await this.repository
            .createQueryBuilder('message')
            .select(['toUser.id', 'toUser.username'])
            .distinct(true)
            .leftJoinAndSelect('message.toUser', 'toUser')
            .leftJoinAndSelect('message.fromUser', 'fromUser')
            .where('fromUser.id = :userId', { userId: payload?.userId })
            .orWhere('toUser.id = :userId2', { userId2: payload?.userId })
            .getRawMany();
    }

    @Subscription({
        topics: 'NEW_MESSAGE',
        filter: ({
            payload: messagePayload,
            context,
        }: {
            payload: Message;
            context: MyContext;
        }) => {
            console.log(messagePayload.toUser.id, context.payload?.userId);
            return messagePayload.toUser.id === context.payload?.userId;
        },
    })
    @Authorized()
    newMessage(@Root() messagePayload: Message): Message {
        return messagePayload;
    }
}
