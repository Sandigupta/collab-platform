import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/db';
import { config } from '../config';
import { AppError } from '../utils/AppError';

export class AuthService {
    static async signup(name: string, email: string, password: string) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new AppError('Email already in use', 409, 'AUTH_EMAIL_EXISTS');
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, passwordHash },
            select: { id: true, name: true, email: true, avatar: true, createdAt: true },
        });

        const signOptions: SignOptions = { expiresIn: config.jwt.expiresIn as any };
        const token = jwt.sign({ userId: user.id }, config.jwt.secret, signOptions);

        return { user, token };
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new AppError('Invalid credentials', 401, 'AUTH_INVALID_CREDENTIALS');
        }

        const signOptions2: SignOptions = { expiresIn: config.jwt.expiresIn as any };
        const token = jwt.sign({ userId: user.id }, config.jwt.secret, signOptions2);

        return {
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
            token,
        };
    }

    static async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, avatar: true, createdAt: true },
        });
        if (!user) {
            throw new AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        return user;
    }
}
