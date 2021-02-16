
import { InputType, Field } from "type-graphql";

import { Game } from "../../entities/game";

@InputType()
export class GameInput implements Partial<Game> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}