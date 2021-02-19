import { ObjectType, Field, ID } from 'type-graphql';
import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable} from 'typeorm';
import { Rating } from './Rating';
import {Game} from "./Game";
import {Language} from "./Language";


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
	@Column('varchar')
	description: string;

	@Column()
	password: string;

	@OneToMany(() => Rating, (rating) => rating.user)
	ratings: Rating[];

	@Field(() => [Game], {nullable: true})
	@ManyToMany(() => Game)
	@JoinTable()
	games: Game[];

	@Field(() => [Language], {nullable: true})
	@ManyToMany(() => Language)
	@JoinTable()
	languages: Language[];
}
