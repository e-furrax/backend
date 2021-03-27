import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Transaction } from './Transaction';

@ObjectType()
export class Appointment {
    @Field(() => ID)
    @Property({ required: true })
    public userId: ObjectId;

    @Field()
    @Property({ default: new Date(), required: true })
    public date: Date;

    @Field(() => [Transaction])
    @Property({ type: () => Transaction, default: [] })
    public transaction: Transaction[];
}
export const AppointmentModel = getModelForClass(Appointment);
