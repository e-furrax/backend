import { InputType, Field, Int } from 'type-graphql';
import { User } from '../../entities/postgres/User';

@InputType()
export class UserInput implements Partial<User> {
    @Field(() => Int)
    public id: number;
}
