import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
@ObjectType()
export class Rating extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    rating: string;

    @Field()
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @Field()
    @Column()
    comments: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.givenRatings)
    fromUser: User;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.receivedRatings)
    toUser: User;
}
