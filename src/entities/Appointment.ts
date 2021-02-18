import { prop } from '@typegoose/typegoose';

export class Appointment {
  @prop()
  public userId!: number;

  @prop()
  public date!: Date;
}
