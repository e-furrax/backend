import { Field, ID, ObjectType } from 'type-graphql';
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./User";


@ObjectType()
@Entity()
export class Language extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	readonly id: number;

	@Field()
	@Column('text', { unique: true })
	name: string;

	@Field()
	@Column('text', { unique: true })
	code: string;

	@Field(() => [User], { nullable: true })
	@ManyToMany(() => User)
	@JoinTable()
	users: User[];
}
