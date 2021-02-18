import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Appointment } from './Appointment';

@ObjectType()
export class Calendar {
  @Field(() => ID)
  readonly id: ObjectId;

  @Field(() => Int)
  @Property({ unique: true, required: true })
  public userId: number

  @Field(() => [Appointment])
  @Property({ ref: 'Appointment', default: [] })
  public appointments: Ref<Appointment>[];
}

export const CalendarModel = getModelForClass(Calendar);
