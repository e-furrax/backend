import { InputType, Field, Int } from 'type-graphql';
import { Appointment } from '../../entities/mongo/Appointment';

@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field(() => Int)
    public userId: number;

    @Field(() => Int)
    public price: number;
}
