import logger from "pino";
import dayjs from "dayjs";
import config from "config";

const level :string= config.get('logLevel');

export const log = logger({
    transport:{
        target:"pino-pretty"
    },
    level,
    base:{
        pid:false
    },
    timestamp:() => `, "time":"${dayjs().format()}"`
})