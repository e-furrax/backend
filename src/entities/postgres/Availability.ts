import { ObjectType, Field, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    //@Column({ type: 'text', default: '[{\'name\':\'Monday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false},{\'name\':\'Tuesday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false},{\'name\':\'Wednesday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false},{\'name\':\'Thursday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false},{\'name\':\'Friday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false},{\'name\':\'Saturday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false},{\'name\':\'Sunday\',\'start\':\'08:00\',\'end\':\'18:00\',\'enabled\':false}]' })
    @Field()
    @Column({
        type: 'text',
        default: [
            { name: 'Monday', start: '08:00', end: '18:00', enabled: false },
            { name: 'Tuesday', start: '08:00', end: '18:00', enabled: false },
            { name: 'Wednesday', start: '08:00', end: '18:00', enabled: false },
            { name: 'Thursday', start: '08:00', end: '18:00', enabled: false },
            { name: 'Friday', start: '08:00', end: '18:00', enabled: false },
            { name: 'Saturday', start: '08:00', end: '18:00', enabled: false },
            { name: 'Sunday', start: '08:00', end: '18:00', enabled: false },
        ],
    })
    value: string;
}
