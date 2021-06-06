import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

enum Status {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

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

    @Field()
    @Column('string')
    public status: Status;

    @Field()
    @Column({ nullable: true })
    public description?: string;

    constructor(price: number, description: string, status = Status.PENDING) {
        this.price = price;
        this.description = description;
        this.status = status;
    }
}
