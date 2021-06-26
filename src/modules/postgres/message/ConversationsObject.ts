import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class ConversationsObject {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    username: string;
}
