import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Appointment } from './Appointment';

class Calendar {
  @prop()
  public furryId!: number

  @prop({ ref: 'Appointment' })
  public appointments?: Ref<Appointment>[];
}

const CalendarModel = getModelForClass(Calendar);

export {
    CalendarModel,
}