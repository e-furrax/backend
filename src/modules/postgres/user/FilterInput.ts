import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class FilterInput {
    @Field(() => [Int], { nullable: true })
    games?: number[];

    @Field(() => [Int], { nullable: true })
    languages?: number[];

    @Field({ nullable: true })
    gender?: string;
}
