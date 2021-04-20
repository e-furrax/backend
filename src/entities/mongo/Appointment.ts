import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';
import { Transaction } from './Transaction';

@ObjectType()
@Entity()
export class Appointment {
    @Field(() => ID)
    @ObjectIdColumn()
    readonly _id: ObjectID;

    @Field()
    @Column({ nullable: false })
    public userId: number;

    @Field()
    @Column()
    public title: string;

    @Field()
    @Column({ default: new Date(), nullable: false })
    public date: Date;

    @Field(() => [Transaction])
    @Column(() => Transaction)
    public transactions: Transaction[];

    constructor(userId: number, title: string) {
        this.userId = userId;
        this.title = title;
        this.transactions = [];
    }
}
