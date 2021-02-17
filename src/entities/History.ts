import { prop, getModelForClass } from '@typegoose/typegoose';

class History {
  @prop()
  public name?: string;

  @prop({ type: () => [String] })
  public jobs?: string[];
}

const HistoryModel = getModelForClass(History); // UserModel is a regular Mongoose Model with correct types

export {
  HistoryModel,
}