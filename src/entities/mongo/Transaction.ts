import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus as Status } from '@/services/enum/transactionStatus';

@ObjectType()
@Entity()
export class Transaction {
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
    readonly price: number;

    @Field(() => Status)
    @Column('string')
    public status: Status;

    @Field()
    @Column({ nullable: true })
    public description?: string;

    constructor(price: number, description: string) {
        this.price = price;
        this.description = description;
        this.status = Status.PENDING;
    }
}
