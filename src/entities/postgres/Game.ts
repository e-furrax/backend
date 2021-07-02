import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { Statistic } from './Statistic';

@Entity()
@ObjectType()
export class Game extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column({ type: 'text', unique: true })
    name: string;

    @Field(() => [Statistic], { defaultValue: [] })
    @OneToMany(() => Statistic, (statistic) => statistic.game)
    statistics: Statistic[];
}
