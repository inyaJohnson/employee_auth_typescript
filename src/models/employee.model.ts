import { prop, getModelForClass, modelOptions, Severity, Pre, DocumentType, index } from "@typegoose/typegoose";
import { v4 as uuidv4 } from 'uuid';
import  argon2  from 'argon2';
import { log } from "../utils/logger";

export const privateFields = [
    'password',
    '__v',
    'verificationCode',
    'passwordResetCode',
    'verified'
];

@Pre<Employee>('save', async function() {
    if(!this.isModified('password')){
        return ;
    }
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return;
})

@index({email : 1})
@modelOptions({
    schemaOptions:{
        timestamps: true
    },
    options:{
        allowMixed: Severity.ALLOW
    }
})
export class Employee{
    @prop({
        lowercase : true, required:true, unique:true
    })
    email: string;

    @prop({
        required: true
    })
    firstName : string;

    @prop({
        required: true
    })
    lastName : string;

    @prop({
        required: true
    })
    password : string;

    @prop({
        required: true,
        default: () => uuidv4()
    })
    verificationCode : string;

    @prop()
    passwordResetCode : string|null;

    @prop({
        default: false,
    })
    verified : boolean;


    async validatePassword(this: DocumentType<Employee>, candidatePassword:string){
        try{
            return await argon2.verify(this.password, candidatePassword)
        }catch(e){
            log.error(e, "Could not validate password");
        }
    }
}

const EmployeeModel = getModelForClass(Employee);

export default EmployeeModel;