import { InputType, Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@InputType()
export class CalendarInput {
    @Field(() => Int)
    public userId: number;
}
