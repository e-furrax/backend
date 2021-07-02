import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
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
export class Appointment extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    readonly _id: ObjectId;

    @Field()
    @CreateDateColumn()
    _createdAt: Date;

    @Field()
    @UpdateDateColumn()
    _updatedAt: Date;

    @Field({ nullable: true })
    @Column()
    from: number;

    @Field()
    @Column()
    to: number;

    @Field()
    @Column()
    date: Date;

    @Field()
    @Column()
    description: string;

    @Field(() => AppointmentStatus)
    @Column('string', { default: AppointmentStatus.PENDING })
    status: AppointmentStatus;

    @Field(() => [Transaction])
    @Column(() => Transaction)
    transactions: Transaction[];
}
