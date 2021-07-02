import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { isExistingUser } from '@/services/annotations/isExistingUser';
import { Appointment } from '@/entities/mongo/Appointment';
import { Transaction } from '@/entities/mongo/Transaction';

@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field({ nullable: true })
    @isExistingUser({ message: 'User ID $value for variable `from` not found' })
    from?: number;

    @Field()
    @isExistingUser({ message: 'User ID $value for variable `to` not found' })
    to: number;

    @Field()
    date: Date;

    @Field()
    description: string;
}

@InputType()
export class AppointmentIdsInput {
    @Field(() => [String])
    ids: string[];
}

@InputType()
export class TransactionInput implements Partial<Transaction> {
    @Field()
    price: number;

    @Length(5, 128)
    description: string;
}
