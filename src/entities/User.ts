import { ObjectType, Field, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
