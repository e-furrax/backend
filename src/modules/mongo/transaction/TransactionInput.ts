import { ObjectId } from 'mongodb';
import { InputType, Field, ID } from 'type-graphql';
import { Transaction } from '@/entities/mongo/Transaction';

@InputType()
export class TransactionInput implements Partial<Transaction> {
    @Field(() => ID)
    public id: ObjectId;

    @Field()
    public price: number;

    @Field()
    public status: string;
}
