import { verify } from "argon2";
import { Request, Response } from "express";
import { CreateEmployeeInput, ForgotPasswordInput, ResetPasswordInput, VerifyEmployeeInput } from "../schema/employee.schema";
import { createEmployee, findEmployeeByEmail, findEmployeeById } from "../services/employee.service";
import { sendEmail } from "../utils/mailer";
import { v4 as uuidv4 } from 'uuid';


export async function createEmployeeHandler(req :Request<{}, {}, CreateEmployeeInput> , res :Response){
    const body = req.body
    try{
        const employee = await createEmployee(body)
        await sendEmail({
            from: 'test@example.com',
            to: employee.email,
            subject: 'Please verify your account',
            text:`Verification code ${employee.verificationCode}. Id:${employee._id}`
        });
        return res.send("User successfully created.")
    }catch(e:any){
        if(e.code === 11000){
            return res.status(409).send('Account Already Exist.')
        }
        return res.status(500).send(e);
    }
}

export async function verifyEmployeeHandler(req: Request<VerifyEmployeeInput>, res: Response){
    const id = req.params.id;
    const verificationCode  = req.params.verificationCode;
    const employee = await findEmployeeById(id);
    if(!employee){
        return res.send('Employee does not exist...')
    }
    //check verification status
    if(employee.verified){
        return res.send('Employee is already verified...')
    }
    //check verification code match
    if(employee.verificationCode == verificationCode){
        employee.verified = true;
        await employee.save();
        return res.send('Employee successfully verified');
    }
    return res.send('Unable to verify Employee');
}


export async function forgotPasswordHandler( req:Request<{}, {}, ForgotPasswordInput>, res:Response ){
    const email = req.body.email;
    const employee = await findEmployeeByEmail(email);

    if(!employee){
        return res.send('If an Employee exist with this email you will receive an email.')
    }

    if(!employee.verified){
        return res.send('Employee is not verified');
    }

    employee.passwordResetCode = uuidv4();
    await employee.save();

    await sendEmail({
        to: employee.email,
        from:"test@example.com",
        subject:"Reset your password",
        text:`Password reset code ${employee.passwordResetCode}. Id:${employee._id}`
    })

    return res.send('Email sent successfully.')

}

export async function resetPasswordHandler( req:Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res:Response ){
    const { id, passwordResetCode} = req.params;
    const { password } = req.body;

    const employee = findEmployeeById(id);

    if(!employee || !employee.passwordResetCode || employee.passwordResetCode !== passwordResetCode){
        return res.status(400).send('Could not reset Employees password');
    }

    employee.passwordResetCode = null;
    employee.password = password;
    await employee.save();
    return res.send('Password reset successfully.');
}

export async function getCurrentEmployeeHandler(req:Request, res:Response){
    return res.send(res.locals.employee);   
}
