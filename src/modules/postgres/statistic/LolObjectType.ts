import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LolObjectType {
    @Field()
    leagueId: string;

    @Field()
    queueType: string;

    @Field()
    tier: string;

    @Field()
    rank: string;

    @Field()
    summonerId: string;

    @Field()
    summonerName: string;

    @Field()
    leaguePoints: number;

    @Field()
    wins: number;

    @Field()
    losses: number;

    @Field()
    veteran: boolean;

    @Field()
    inactive: boolean;

    @Field()
    freshBlood: boolean;

    @Field()
    hotStreak: boolean;
}
