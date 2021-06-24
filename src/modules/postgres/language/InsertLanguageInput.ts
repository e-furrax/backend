import { Field, InputType } from 'type-graphql';

@InputType()
export class InsertLanguageInput {
    @Field()
    name: string;
}
