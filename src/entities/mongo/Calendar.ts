import { ObjectId } from 'mongodb';
import { prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { Appointment } from './Appointment';

@ObjectType()
export class Calendar {
    @Field(() => ID)
    readonly _id: ObjectId;

    @Field()
    @Property({ unique: true, required: true })
    public userId: number;

    @Field(() => [Appointment])
    @Property({ ref: () => 'Appointment' })
    public appointments: Ref<Appointment>[];
}

export const CalendarModel = getModelForClass(Calendar);
