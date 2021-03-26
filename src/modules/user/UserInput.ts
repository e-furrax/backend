import { InputType, Field, Int } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class UserInput implements Partial<User> {
    @Field(() => Int)
    public id: number;
}

@InputType()
export class UpdateProfileInput implements Partial<User> {
    @Field()
    email: string;
    @Field()
    description?: string;
    @Field()
    username: string;
}
