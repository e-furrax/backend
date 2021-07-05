import { InputType, Field } from 'type-graphql';
import { GamesInput } from '../game/GamesInput';
import { LanguagesInput } from '../language/LanguagesInput';

@InputType()
export class BecomeFurraxInput {
    @Field(() => GamesInput)
    games: GamesInput;

    @Field()
    description?: string;

    @Field()
    availability: string;

    @Field(() => LanguagesInput)
    languages: LanguagesInput;
}
