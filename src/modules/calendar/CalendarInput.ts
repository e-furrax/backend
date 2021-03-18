import { InputType, Field, Int } from "type-graphql";
import { Calendar } from "../../entities/Calendar";

@InputType()
export class CalendarInput implements Partial<Calendar> {
  @Field(() => Int)
  public userId: number;
}
