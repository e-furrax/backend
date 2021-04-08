import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Transaction } from './Transaction';
import { Calendar } from './Calendar';

@ObjectType()
export class Appointment {
    @Field(() => ID)
    readonly _id: ObjectId;

    @Field()
    @Property({ required: true })
    public title: string;

    @Field(() => Calendar)
    @Property({ ref: 'Calendar', required: true })
    public calendar: Calendar | ObjectId;

    @Field()
    @Property({ default: new Date(), required: true })
    public date: Date;

    @Field(() => [Transaction])
    @Property({ type: () => Transaction, default: [] })
    public transactions: Transaction[];
}
export const AppointmentModel = getModelForClass(Appointment);
