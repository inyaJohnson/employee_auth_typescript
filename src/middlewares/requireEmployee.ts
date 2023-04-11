import { NextFunction, Request, Response } from "express";

export const requireEmployee = (req: Request, res: Response, next : NextFunction) => {
    const employee = res.locals.employee;
    if(!employee){
        res.status(403).send('Unauthorized');
    }
    return next();
}


export default requireEmployee;