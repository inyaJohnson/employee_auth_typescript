import express from 'express';
import { createEmployeeHandler, forgotPasswordHandler, getCurrentEmployeeHandler, resetPasswordHandler, verifyEmployeeHandler } from '../controllers/employee.controller';
import requireEmployee from '../middlewares/requireEmployee';
import validateResource from '../middlewares/validateResource';
import { createEmployeeSchema, ForgotPasswordSchema, ResetPasswordSchema, verifyEmployeeSchema } from '../schema/employee.schema';

const router = express.Router();

router.get('/api/employees/verify/:id/:verificationCode', validateResource(verifyEmployeeSchema), verifyEmployeeHandler);
router.post('/api/employees/reset-password', validateResource(ForgotPasswordSchema), forgotPasswordHandler);
router.get('/api/employees/reset-password', validateResource(ResetPasswordSchema), resetPasswordHandler);
router.post('/api/employees', validateResource(createEmployeeSchema), createEmployeeHandler);
router.get('/api/me', requireEmployee, getCurrentEmployeeHandler);
export default router;