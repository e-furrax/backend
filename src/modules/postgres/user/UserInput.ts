import { InputType, Field, Int } from 'type-graphql';
import { User } from '@/entities/postgres/User';
import { isExistingUser } from '../../../services/annotations/isExistingUser';

@InputType()
export class UserInput implements Partial<User> {
    @Field(() => Int)
    @isExistingUser({ message: 'User id $value not found' })
    public id: number;
}
