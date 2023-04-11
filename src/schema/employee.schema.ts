import { object, string, TypeOf } from "zod";

export const createEmployeeSchema = object({
    body: object({
        firstName : string ({
            required_error : "First name is required"
        }),
        lastName : string ({
            required_error : "Last name is required"
        }),
        password : string ({
            required_error : "Password is required"
        }).min(6, "Password is too short - should be min 6 chars"),
        passwordConfirmation : string ({
            required_error : "Password Confirmation is required"
        }),
        email : string ({
            required_error : "Email is required"
        }).email("Not a valid email"),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Password do not match",
        path: ["passwordConfirmation"],
    })
});

export type CreateEmployeeInput = TypeOf<typeof createEmployeeSchema>['body']

export const verifyEmployeeSchema = object({
    params : object({
        id : string(),
        verificationCode : string()
    })
})

export type VerifyEmployeeInput = TypeOf<typeof verifyEmployeeSchema>['params']


export const ForgotPasswordSchema = object({
    body : object({
        email : string({
            required_error: "Email is required"
        }).email("Invalid email"),
    })
})

export type ForgotPasswordInput = TypeOf<typeof ForgotPasswordSchema>['body']


export const ResetPasswordSchema = object({
    params : object({
        id:string(),
        passwordResetCode: string()
    }),
    body : object({
        password : string ({
            required_error : "Password is required"
        }).min(6, "Password is too short - should be min 6 chars"),
        passwordConfirmation : string ({
            required_error : "Password Confirmation is required"
        })
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Password do not match",
        path: ["passwordConfirmation"],
    })
})


export type ResetPasswordInput = TypeOf<typeof ResetPasswordSchema>


