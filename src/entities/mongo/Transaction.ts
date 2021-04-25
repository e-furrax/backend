import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
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
    @Column({ default: 'PENDING' })
    public status: string;

    @Field()
    @Column({ nullable: true })
    public description?: string;

    constructor(price: number, description: string) {
        this.price = price;
        this.description = description;
    }
}
