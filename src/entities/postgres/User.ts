import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToMany,
} from 'typeorm';
import { Rating } from './Rating';
import { Language } from './Language';
import { Game } from './Game';
import { Availability } from './Availability';
import { Message } from './Message';
import { Statistic } from './Statistic';

export enum Status {
    INCOMPLETE,
    UNVERIFIED,
    VERIFIED,
}

registerEnumType(Status, {
    name: 'Status',
    description: 'The user statuses',
});

export enum UserRole {
    USER = 'USER',
    FURRAX = 'FURRAX',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
    name: 'Role',
    description: 'Basic user role',
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

    @Field(() => UserRole)
    @Column('text', { default: UserRole.USER })
    role: UserRole;

    @Field(() => Status)
    @Column('int', { default: Status.VERIFIED })
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

    @Field(() => [Game], { defaultValue: [] })
    @ManyToMany(() => Game)
    @JoinTable()
    games: Game[];

    @Field(() => [Language], { defaultValue: [] })
    @ManyToMany(() => Language)
    @JoinTable()
    languages: Language[];

    @Field(() => [Message], { defaultValue: [] })
    @OneToMany(() => Rating, (message) => message.toUser)
    receivedMessages: Message[];

    @Field(() => [Message], { defaultValue: [] })
    @OneToMany(() => Message, (message) => message.fromUser)
    sentMessages: Message[];

    @Field()
    @OneToOne(() => Availability)
    @JoinColumn()
    availability: Availability;

    @Field(() => [Statistic], { defaultValue: [] })
    @OneToMany(() => Statistic, (statistic) => statistic.user)
    statistics: Statistic[];
}
