import express from "express";
import  employees from "./employee.routes";
import  auth from "./auth.routes";


const router = express.Router();

router.get('/healthcheck', (_, res) => {
    res.sendStatus(200);
})

router.use(employees);
router.use(auth);

export default router;