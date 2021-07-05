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
import { User, UserRole } from '@/entities/postgres/User';
import { MessageInput } from './MessageInput';

@Resolver(() => Message)
@Service()
export class MessageResolver {
    private repository: Repository<Message>;
    private userRepository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Message);
        this.userRepository = this.postgresService.getRepository(User);
    }

    async findConversationId(
        fromUser: number,
        toUser: number
    ): Promise<number> {
        const conversationId = await this.repository
            .createQueryBuilder('message')
            .select('message.conversationId')
            .leftJoinAndSelect('message.toUser', 'toUser')
            .leftJoinAndSelect('message.fromUser', 'fromUser')
            .where('fromUser.id IN (:...users)', { users: [fromUser, toUser] })
            .andWhere('toUser.id IN (:...usersAgain)', {
                usersAgain: [fromUser, toUser],
            })
            .getRawOne();

        return conversationId
            ? conversationId.message_conversationId
            : (await this.findMaxConversationId()) + 1;
    }

    async findMaxConversationId(): Promise<number> {
        const maxConversationId = await this.repository
            .createQueryBuilder('message')
            .select('MAX(message.conversationId)', 'max')
            .getRawOne();

        return maxConversationId && maxConversationId.max
            ? maxConversationId.max
            : 0;
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

        const conversationId = await this.findConversationId(
            fromUser.id,
            toUserFound.id
        );

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
            conversationId,
        });

        await this.repository.save(newMessage);

        await pubSub.publish('NEW_MESSAGE', newMessage);

        return true;
    }

    @Query(() => [Message])
    @UseMiddleware(isAuth)
    @Authorized()
    async getConversation(@Arg('conversationId') conversationId: number) {
        return await this.repository.find({
            where: {
                conversationId,
            },
            relations: ['fromUser', 'toUser'],
        });
    }

    @Query(() => [Message])
    @UseMiddleware(isAuth)
    async getConversations(@Ctx() { payload }: MyContext): Promise<Message[]> {
        const conversationsIds = await this.repository
            .createQueryBuilder('message')
            .select('message.conversationId')
            .distinct(true)
            .leftJoin('message.toUser', 'toUser')
            .leftJoin('message.fromUser', 'fromUser')
            .where('fromUser.id = :userId', { userId: payload?.userId })
            .orWhere('toUser.id = :userId2', { userId2: payload?.userId })
            .getRawMany();

        const conversationsLastMessage = [];
        for (const conversationId of conversationsIds) {
            const lastMessageId = await this.repository
                .createQueryBuilder('message')
                .select('MAX(id)', 'max')
                .where('message.conversationId = :cid', {
                    cid: conversationId.message_conversationId,
                })
                .getRawOne();

            if (!lastMessageId) {
                throw new Error('Could not find lastMessageId');
            }

            const lastMessage = await this.repository.findOne({
                where: {
                    id: lastMessageId.max,
                },
                relations: ['fromUser', 'toUser'],
            });

            if (!lastMessage) {
                throw new Error('Could not find lastMessage');
            }

            conversationsLastMessage.push(lastMessage);
        }

        conversationsLastMessage.sort((m1, m2) => {
            return (
                new Date(m2.createdAt).getTime() -
                new Date(m1.createdAt).getTime()
            );
        });

        return conversationsLastMessage;
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
            return (
                messagePayload.toUser.id === context.payload?.userId ||
                messagePayload.fromUser.id === context.payload?.userId
            );
        },
    })
    @Authorized([
        UserRole.USER,
        UserRole.FURRAX,
        UserRole.MODERATOR,
        UserRole.ADMIN,
    ])
    newMessage(@Root() messagePayload: Message): Message {
        return messagePayload;
    }
}
