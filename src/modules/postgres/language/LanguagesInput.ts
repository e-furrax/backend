import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class LanguagesInput {
    @Field(() => [Int])
    ids: number[];
}
