import { ObjectType, Field, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './Rating';

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

	@Column()
	password: string;

	@OneToMany(() => Rating, (rating) => rating.user)
	ratings: Rating[];
}