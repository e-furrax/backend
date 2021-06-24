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

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column({ type: 'text', unique: true })
    email: string;

    @Field()
    @Column({ type: 'text', unique: true })
    username: string;

    @Field()
    @Column({ type: 'text' })
    gender: string;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    password: string;

    @Field(() => Status)
    @Column('int', { default: 0 })
    status: Status;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    profileImage: string;

    @Field(() => [Rating], { defaultValue: [] })
    @OneToMany(() => Rating, (rating) => rating.toUser)
    receivedRatings: Rating[];

    @Field(() => [Rating], { defaultValue: [] })
    @OneToMany(() => Rating, (rating) => rating.fromUser)
    givenRatings: Rating[];
}
