import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
// import { IsUsernameAlreadyUsed } from '../annotations/isUsernameAlreadyUsed';
// import { IsEmailAlreadyUsed } from '../annotations/isEmailAlreadyUsed';

@InputType()
export class RegisterInput {
    @Field()
    @Length(2, 40)
    // @IsUsernameAlreadyUsed({ message: 'username is already used' })
    username: string;

    @Field()
    @IsEmail()
    // @IsEmailAlreadyUsed({ message: 'email is already used' })
    email: string;

    @Field()
    password: string;
}
