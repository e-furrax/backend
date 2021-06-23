import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Rating } from './Rating';

export enum Status {
    Unverified,
    Verified,
    Incomplete,
}

registerEnumType(Status, {
    name: 'Status',
    description: 'The user statuses',
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Field()
    @Column('text', { unique: true })
    username: string;

    @Field()
    @Column('text')
    gender: string;

    @Field({ nullable: true })
    @Column('varchar', { nullable: true })
    description: string;

    @Column()
    password: string;

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    profileImage: string;

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings: Rating[];

    @Field(() => Status)
    @Column('int', { default: 0 })
    status: Status;
}
