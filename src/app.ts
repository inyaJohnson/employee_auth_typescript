require("dotenv").config();
import express from 'express';
import config from 'config';
import log, { connectToDb } from './utils/connectToDb';
import router from './routes';
import deserializeEmployee from './middlewares/deserializeEmployee';

const app = express();
app.use(express.json());
app.use(deserializeEmployee);
app.use(router);
const port = config.get("port");
app.listen(port, () => {
    log.info(`App started at to http://localhost:${port}`);
    connectToDb();
})
