import { InputType, Field, Int } from 'type-graphql';
import { User, UserRole } from '@/entities/postgres/User';
import { isExistingUser } from '@/services/annotations/isExistingUser';
import { ReviewStatus } from '@/entities/postgres/PromotionDemand';
@InputType()
export class PromotionInput implements Partial<User> {
    @Field(() => Int)
    @isExistingUser({ message: 'User ID $value not found' })
    public id: number;

    @Field(() => UserRole)
    public role: UserRole;
}

@InputType()
export class DemandeStatusInput {
    @Field(() => Int)
    @isExistingUser({ message: 'User ID $value not found' })
    public id: number;

    @Field(() => ReviewStatus)
    public reviewStatus: ReviewStatus;
}
