import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Rating extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    rating: number;

    @Field()
    @Column()
    comments: string;

    @ManyToOne(() => User, (user) => user.ratings)
    user: User;
}
