import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Employee } from "./employee.model";

export class Session {
  @prop({ ref: () => Employee })
  employee: Ref<Employee>;

  @prop({ default: true })
  valid: boolean;
}

export const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
