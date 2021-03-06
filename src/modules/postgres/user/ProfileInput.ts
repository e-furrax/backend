import { User } from '@/entities/postgres/User';
import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateProfileInput implements Partial<User> {
    @Field()
    email: string;
    @Field()
    description?: string;
    @Field()
    username: string;
}
