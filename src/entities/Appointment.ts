import { prop as Property } from '@typegoose/typegoose';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Appointment {
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
