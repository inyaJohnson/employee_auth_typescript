import config from 'config';
import nodemailer, { SendMailOptions } from "nodemailer";
import { log } from './logger';

const smtp = config.get<{
    user: string,
    pass: string,
    host: string, 
    port: number, 
    secure: boolean 
}>('smtp');

const transporter = nodemailer.createTransport({
    ...smtp, auth: {user: smtp.user, pass : smtp.pass}
})

export async function createTestCreds(){
    const creds = await nodemailer.createTestAccount();
    console.log({creds})
}

export async function sendEmail(payload:SendMailOptions){
    transporter.sendMail(payload, (error, info) => {
        if(error){
            log.error(error, 'Error occured while sending Email.');
            return;
        }
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    })
}