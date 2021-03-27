import { ObjectId } from 'mongodb';
import { InputType, Field, ID } from 'type-graphql';
import { Appointment } from '@/entities/mongo/Appointment';

@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field(() => ID)
    public userId: ObjectId;
}
