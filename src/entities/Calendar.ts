import { ObjectId } from "mongodb";
import { prop as Property, getModelForClass, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, Int, ID } from "type-graphql";
import { Appointment } from "./Appointment";

@ObjectType()
export class Calendar {
  @Field(() => ID)
  readonly id: ObjectId;

  @Field(() => Int)
  @Property({ unique: true, required: true })
  public userId: number;

  @Field(() => [Appointment])
  @Property({ type: () => Appointment, default: [] })
  public appointments: Appointment[];
}

export const CalendarModel = getModelForClass(Calendar);
