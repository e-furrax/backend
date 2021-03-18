import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyUsed, IsUsernameAlreadyUsed } from "./isAlreadyUsed";

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 40)
  @IsUsernameAlreadyUsed({ message: "username is already used" })
  username: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyUsed({ message: "email is already used" })
  email: string;

  @Field()
  password: string;
}
