import { Field, InputType } from 'type-graphql';
import { Rating } from '@/entities/postgres/Rating';
import { User } from '@/entities/postgres/User';
import { ToUserInput } from './ToUserInput';

@InputType()
export class RatingInput implements Partial<Rating> {
    @Field({ nullable: true })
    comments: string;

    @Field()
    rating: string;

    @Field(() => ToUserInput)
    toUser: User;
}
