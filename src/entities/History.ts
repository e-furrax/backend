import { prop, getModelForClass } from '@typegoose/typegoose';

class History {
  @prop()
  public userId!: number;

  @prop()
  public furryId!: number;

  @prop()
  public price!: number;

  @prop()
  public appointmentDate!: Date;
}

const HistoryModel = getModelForClass(History, { schemaOptions: { timestamps: true }});

export {
  HistoryModel,
}