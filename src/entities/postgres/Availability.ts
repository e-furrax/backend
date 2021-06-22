import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

// const defaultAvailibities = [
//     { 'name': 'Monday', 'start': '08:00', 'end': '18:00', 'enabled': false },
//     { 'name': 'Tuesday', 'start': '08:00', 'end': '18:00', 'enabled': false },
//     { 'name': 'Wednesday', 'start': '08:00', 'end': '18:00', 'enabled': false },
//     { 'name': 'Thursday', 'start': '08:00', 'end': '18:00', 'enabled': false },
//     { 'name': 'Friday', 'start': '08:00', 'end': '18:00', 'enabled': false },
//     { 'name': 'Saturday', 'start': '08:00', 'end': '18:00', 'enabled': false },
//     { 'name': 'Sunday', 'start': '08:00', 'end': '18:00', 'enabled': false }
// ];

@Entity()
@ObjectType()
export class Availability extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field({
        defaultValue:
            "[{'name':'Monday','start':'08:00','end':'18:00','enabled':false},{'name':'Tuesday','start':'08:00','end':'18:00','enabled':false},{'name':'Wednesday','start':'08:00','end':'18:00','enabled':false},{'name':'Thursday','start':'08:00','end':'18:00','enabled':false},{'name':'Friday','start':'08:00','end':'18:00','enabled':false},{'name':'Saturday','start':'08:00','end':'18:00','enabled':false},{'name':'Sunday','start':'08:00','end':'18:00','enabled':false}]",
    })
    @Column()
    value: string;

    @Field(() => User)
    @OneToOne(() => User, (user) => user.availability)
    user: User;
}
