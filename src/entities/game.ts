
import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, Column, OneToMany, RelationId, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Rate } from './rate';
import { User } from './user';

@Entity()
@ObjectType()
export class Game {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    title: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description?: string;

    @Field(() => [Rate])
    @OneToMany(() => Rate, rate => rate.game, { cascade: ["insert"] })
    ratings: Rate[];
  
    @Field(() => User)
    @ManyToOne(() => User)
    author: User;

    @RelationId((game: Game) => game.author)
    authorId: number;
}