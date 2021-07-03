import { Field, InputType } from 'type-graphql';
import { Rating } from '@/entities/postgres/Rating';
import { User } from '@/entities/postgres/User';
import { UserInput } from './../user/UserInput';

@InputType()
export class RatingInput implements Partial<Rating> {
    @Field({ nullable: true })
    comments: string;

    @Field()
    rating: string;

    @Field(() => UserInput)
    toUser: User;
}

@InputType()
export class RatingIdsInput {
    @Field(() => [Number])
    ids: number[];
}
