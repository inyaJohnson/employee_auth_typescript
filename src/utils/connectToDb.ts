import mongoose from "mongoose";
import config from "config";
import { log } from "./logger";
import { createTestCreds } from "./mailer";


export async function connectToDb() {
  const dbUri: string = config.get("dbUri");
  try {
    await mongoose.connect(dbUri);
    log.info("Connect to DB");
    // console.log(createTestCreds())
  } catch (e) {
    log.info(`${e}`);
  }
}

export default log;