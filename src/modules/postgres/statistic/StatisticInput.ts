import { Field, InputType } from 'type-graphql';
import { Statistic } from '@/entities/postgres/Statistic';
import { Game } from '@/entities/postgres/Game';
import { GameInput } from '../game/GameInput';

@InputType()
export class StatisticInput implements Partial<Statistic> {
    @Field({ nullable: false })
    rank: string;

    @Field({ nullable: false })
    mode: string;

    @Field(() => GameInput)
    game: Game;

    @Field({ nullable: true })
    playerId: string;
}
