import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { Appointment } from './Appointment';
@ObjectType()
export class Transaction {
    @Field(() => ID)
    readonly _id: ObjectId;

    @Field()
    @Property({ required: true })
    public price: number;

    @Field()
    @Property({ default: new Date(), required: true })
    public date: Date;

    @Field()
    @Property({ default: 'PENDING', required: true })
    public status: string;

    @Field(() => Appointment)
    @Property({ ref: 'Appointment', required: true })
    public appointment: Appointment | ObjectId;

    @Field({ nullable: true })
    @Property()
    public description?: string;
}
export const TransactionModel = getModelForClass(Transaction);
