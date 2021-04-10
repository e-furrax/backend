import { Field, InputType, ObjectType } from 'type-graphql';
import { Appointment } from '@/entities/mongo/Appointment';

@ObjectType()
@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field()
    public title: string;
}
