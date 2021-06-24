import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class GamesInput {
    @Field(() => [Int])
    ids: number[];
}
