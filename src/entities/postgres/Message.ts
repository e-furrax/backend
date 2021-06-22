import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
@ObjectType()
export class Message extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    content: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.sentMessages)
    fromUser: User;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.receivedMessages)
    toUser: User;

    @Field()
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
}
