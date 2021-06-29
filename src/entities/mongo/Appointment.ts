import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './Transaction';
import { AppointmentStatus as Status } from '@/services/enum/appointmentStatus';

@ObjectType()
@Entity()
export class Appointment {
    @Field(() => ID)
    @ObjectIdColumn()
    readonly _id: ObjectId;

    @Field()
    @CreateDateColumn()
    _createdAt: Date;

    @Field()
    @UpdateDateColumn()
    _updatedAt: Date;

    @Field()
    @Column()
    public from: number;

    @Field()
    @Column()
    public to: number;

    @Field()
    @Column()
    public title: string;

    @Field(() => Status)
    @Column('string')
    public status: Status;

    @Field(() => [Transaction])
    @Column(() => Transaction)
    public transactions: Transaction[];

    constructor(
        from: number,
        to: number,
        title: string,
        status = Status.PENDING
    ) {
        this.from = from;
        this.to = to;
        this.title = title;
        this.transactions = [];
        this.status = status;
    }
}
