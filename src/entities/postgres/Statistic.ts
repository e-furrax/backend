import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Game } from './Game';

@Entity()
@ObjectType()
export class Statistic extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    playerId: string;

    @Field()
    @Column()
    rank: string;

    @Field()
    @Column()
    mode: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.statistics)
    user: User;

    @Field(() => Game)
    @ManyToOne(() => Game, (game) => game.statistics)
    game: Game;

    @Field()
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;

    @Field()
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
}
