import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../utils/validators';
import { verifyToken } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), AuthController.signup);
authRouter.post('/login', validate(loginSchema), AuthController.login);
authRouter.get('/me', verifyToken, AuthController.getMe);
