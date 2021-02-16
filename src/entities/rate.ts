import { ObjectType, Field, Int } from 'type-graphql';
import { Column, Entity, ManyToOne, RelationId, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

import { User } from './user';
import { Game } from './game';

@Entity()
@ObjectType()
export class Rate { 
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field(() => Int)
    @Column({ type: "int" })
    value: number;

    @Field(() => User)
    @ManyToOne(() => User)
    user: User;

    @RelationId((rate: Rate) => rate.user)
    userId: number;

    @Field()
    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => Game)
    game: Game;

    @RelationId((rate: Rate) => rate.game)
    gameId: number;
}