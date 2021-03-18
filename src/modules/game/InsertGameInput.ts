import { Field, InputType } from "type-graphql";

@InputType()
export class InsertGameInput {
  @Field()
  name: string;
}
