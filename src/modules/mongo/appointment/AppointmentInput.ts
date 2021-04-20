import { Length } from 'class-validator';
import { ObjectID } from 'typeorm';
import { Field, ID, InputType } from 'type-graphql';
import { Appointment } from '@/entities/mongo/Appointment';
import { Transaction } from '@/entities/mongo/Transaction';

@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field(() => ID)
    public _id: ObjectID;

    @Field()
    @Length(2, 40)
    public title: string;

    @Field()
    public userId: number;
}

@InputType()
export class TransactionInput implements Partial<Transaction> {
    @Field()
    public price: number;

    @Length(5, 128)
    public description: string;
}
