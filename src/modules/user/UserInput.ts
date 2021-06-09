import { InputType, Field, Int } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class UserInput implements Partial<User> {
    @Field(() => Int)
    public id: number;
}
