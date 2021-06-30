import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum TransactionStatus {
    CANCELLED = 'CANCELLED',
    REJECTED = 'PAIEMENT_REJECTED',
    PENDING = 'PENDING',
    VALIDATED = 'PAIEMENT_VALIDATED',
}

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus',
    description: 'Basic transaction status',
});

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

    @Field(() => TransactionStatus)
    @Column('string')
    public status: TransactionStatus;

    @Field()
    @Column({ nullable: true })
    public description?: string;

    constructor(price: number, description: string) {
        this.price = price;
        this.description = description;
        this.status = TransactionStatus.PENDING;
    }
}
