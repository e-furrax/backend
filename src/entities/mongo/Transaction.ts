import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
@ObjectType()
export class Transaction {
    @Field(() => ID)
    readonly id: ObjectId;

    @Field()
    @Property({ required: true })
    public price: number;

    @Field()
    @Property({ default: new Date(), required: true })
    public date: Date;

    @Field()
    @Property({ default: 'PENDING', required: true })
    public status: string;

    @Field()
    @Property({ required: true })
    public appointmentId: string;
}
export const TransactionModel = getModelForClass(Transaction);
