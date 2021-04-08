import { ObjectId } from 'mongodb';
import { InputType, Field, Int, ObjectType, ID } from 'type-graphql';
import { Transaction } from '@/entities/mongo/Transaction';
@ObjectType()
@InputType()
export class NewTransactionInput implements Partial<Transaction> {
    @Field(() => Int)
    price: number;

    @Field(() => ID)
    appointment: ObjectId;
}

@ObjectType()
@InputType()
export class FindTransactionInput implements Partial<Transaction> {
    @Field(() => ID)
    _id: ObjectId;
}
