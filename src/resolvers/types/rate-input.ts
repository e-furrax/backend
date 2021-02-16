import { InputType, Field, Int, ID } from "type-graphql";

@InputType()
export class RateInput {
  @Field(() => ID)
  gameId: string;

  @Field(() => Int)
  value: number;
}