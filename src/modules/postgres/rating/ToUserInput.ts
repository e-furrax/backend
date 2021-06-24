import { Field, InputType } from 'type-graphql';
import { User } from '@/entities/postgres/User';

@InputType()
export class ToUserInput implements Partial<User> {
    @Field()
    id: number;
}
