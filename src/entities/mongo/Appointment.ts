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
    @Column({ nullable: false })
    public userId: number;

    @Field()
    @Column()
    public title: string;

    @Field(() => [Transaction])
    @Column(() => Transaction)
    public transactions: Transaction[];

    constructor(userId: number, title: string) {
        this.userId = userId;
        this.title = title;
        this.transactions = [];
    }
}
