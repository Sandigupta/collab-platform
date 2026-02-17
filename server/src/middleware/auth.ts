import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
    userId?: string;
}

export const verifyToken = (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401, 'AUTH_NO_TOKEN');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error instanceof AppError) throw error;
        next(new AppError('Invalid or expired token', 401, 'AUTH_INVALID_TOKEN'));
    }
};
