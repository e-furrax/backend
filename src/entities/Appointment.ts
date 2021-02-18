import { ObjectId } from 'mongodb';
import { prop as Property } from '@typegoose/typegoose';
import { Field, Int, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class Appointment {
  @Field(() => ID)
  readonly id: ObjectId;

  @Field(() => Int)
  @Property({ required: true })
  public userId: number;

  @Field()
  @Property({ default: new Date(), required: true })
  public date: Date;

  @Field(() => Int)
  @Property({ required: true })
  public price: number;
}
