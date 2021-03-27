import { ObjectId } from 'mongodb';
import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CalendarInput {
    @Field(() => Int)
    public userId: ObjectId;
}
