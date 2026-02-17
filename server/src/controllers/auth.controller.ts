import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const result = await AuthService.signup(name, email, password);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.getMe(req.userId!);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }
}
