import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { User } from './User';

export enum ReviewStatus {
    TO_REVIEW,
    ACCEPTED,
    REJECTED,
    REVOKED,
}
registerEnumType(ReviewStatus, {
    name: 'ReviewStatus',
    description: 'Basic review status',
});

@Entity()
@ObjectType()
export class PromotionDemand extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => ReviewStatus)
    @Column('int', { default: ReviewStatus.TO_REVIEW })
    reviewStatus: ReviewStatus;
}
