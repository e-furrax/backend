import {Field, InputType} from 'type-graphql';

@InputType()
export class UserFilterInput {
    @Field()
    gameId: number

    @Field()
    languageCode: String

    @Field()
    notation: number
}
