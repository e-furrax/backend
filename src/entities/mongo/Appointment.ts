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
    @Column()
    public from: number;

    @Field()
    @Column()
    public to: number;

    @Field()
    @Column()
    public title: string;

    @Field(() => [Transaction])
    @Column(() => Transaction)
    public transactions: Transaction[];

    constructor(from: number, to: number, title: string) {
        this.from = from;
        this.to = to;
        this.title = title;
        this.transactions = [];
    }
}
