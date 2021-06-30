import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './Transaction';

export enum AppointmentStatus {
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
    DONE = 'DONE',
}

registerEnumType(AppointmentStatus, {
    name: 'AppointmentStatus',
    description: 'Basic appointment status',
});

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

    @Field(() => AppointmentStatus)
    @Column('string')
    public status: AppointmentStatus;

    @Field(() => [Transaction])
    @Column(() => Transaction)
    public transactions: Transaction[];

    constructor(
        from: number,
        to: number,
        title: string,
        status = AppointmentStatus.PENDING
    ) {
        this.from = from;
        this.to = to;
        this.title = title;
        this.transactions = [];
        this.status = status;
    }
}
