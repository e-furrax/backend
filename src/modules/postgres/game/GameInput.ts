import { InputType, Field, Int } from 'type-graphql';
import { Game } from '@/entities/postgres/Game';

@InputType()
export class GameInput implements Partial<Game> {
    @Field(() => Int)
    public id: number;
}
