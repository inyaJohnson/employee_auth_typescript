
import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import { Employee, privateFields } from "../models/employee.model";
import SessionModel from "../models/session.model";
import { signJwt } from "../utils/jwt";

export async function createSession({ employeeId }: { employeeId: string }) {
  return SessionModel.create({ employee: employeeId });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export async function signRefreshToken({ employeeId }: { employeeId: string }) {
  const session = await createSession({
    employeeId,
  });

  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn: "1y",
    }
  );

  return refreshToken;
}

export function signAccessToken(employee: DocumentType<Employee>) {
  const payload = omit(employee.toJSON(), privateFields);
  const accessToken = signJwt(payload, "accessTokenPrivateKey", { expiresIn : '15m'});
  return accessToken;
}