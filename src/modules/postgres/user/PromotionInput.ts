import { InputType, Field, Int } from 'type-graphql';
import { User, UserRole } from '@/entities/postgres/User';
import { isExistingUser } from '@/services/annotations/isExistingUser';

@InputType()
export class PromotionInput implements Partial<User> {
    @Field(() => Int)
    @isExistingUser({ message: 'User ID $value not found' })
    public id: number;

    @Field(() => UserRole)
    public role: UserRole;
}
