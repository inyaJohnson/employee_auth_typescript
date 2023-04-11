import { Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionSchema } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.services";
import { findEmployeeByEmail, findEmployeeById } from "../services/employee.service";
import { verifyJwt } from "../utils/jwt";
import { log } from "../utils/logger";

export async function createSessionHandler(req: Request<{}, {}, CreateSessionSchema>, res:Response){
    const {email, password} = req.body;

    const employee = await findEmployeeByEmail(email);

    if(!employee){
        return res.send('Invalid email or password.');
    }

    if(!employee.verified){
        return res.send('Please verifiy your account.');
    }

    const isValid = await employee.validatePassword(password);

    if(!isValid){
        return res.send('Invalid email or password.');
    }

    const accessToken = signAccessToken(employee);
    const refreshToken = await signRefreshToken({employeeId:employee.id})

    return res.send({
        accessToken,
        refreshToken
    })
}


export async function refreshAccessTokenHandler(req : Request, res : Response){
    const refreshToken = get(req, 'headers.x-refresh');
    const decoded = verifyJwt<{session:string}>(refreshToken, 'refreshTokenPublicKey');
    log.info(decoded);
    if(!decoded){
        return res.status(401).send("Could not refresh access token")
    }
    const session = await findSessionById(decoded.session);

    if(!session || !session.valid){
        return res.status(401).send("Could not refresh access token")
    }

    const employee =  await findEmployeeById(String(session.employee));

    if(!employee){
        return res.status(401).send("Could not refresh access token")
    }

    const accessToken = signAccessToken(employee);

    return res.send({accessToken});
}