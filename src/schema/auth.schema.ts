import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Invalid email or password",
    }).email(),
    password: string({
      required_error: "Invalid email or password",
    }).min(6, "Invalid email or password"),
  }),
});

export type CreateSessionSchema = TypeOf<typeof createSessionSchema>["body"];
