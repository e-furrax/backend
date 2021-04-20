import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
@ObjectType()
@Entity()
export class Transaction {
    @Field(() => ID)
    @ObjectIdColumn()
    readonly _id: ObjectID;

    @Field()
    @Column()
    public price: number;

    @Field()
    @Column()
    public date: Date;

    @Field()
    @Column({ default: 'PENDING' })
    public status: string;

    @Field()
    @Column({ nullable: true })
    public description?: string;

    constructor(price: number, description: string, date = new Date()) {
        this.price = price;
        this.date = date;
        this.description = description;
    }
}
