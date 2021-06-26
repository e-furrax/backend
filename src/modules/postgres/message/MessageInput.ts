import { Field, InputType } from 'type-graphql';
import { Message } from '@/entities/postgres/Message';
import { User } from '@/entities/postgres/User';
import { UserInput } from '@/modules/postgres/user/UserInput';

@InputType()
export class MessageInput implements Partial<Message> {
    @Field({ nullable: true })
    content: string;

    @Field(() => UserInput)
    toUser: User;
}
