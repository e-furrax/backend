import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { isExistingUser } from '@/services/annotations/isExistingUser';
import { Appointment } from '@/entities/mongo/Appointment';
import { Transaction } from '@/entities/mongo/Transaction';

@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field()
    @Length(2, 40)
    public title: string;

    @Field({ nullable: true })
    @isExistingUser({ message: 'User ID $value for variable `from` not found' })
    public from?: number;

    @Field()
    @isExistingUser({ message: 'User ID $value for variable `to` not found' })
    public to: number;
}

@InputType()
export class TransactionInput implements Partial<Transaction> {
    @Field()
    public price: number;

    @Length(5, 128)
    public description: string;
}
