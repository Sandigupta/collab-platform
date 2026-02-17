import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        // Clean up
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('token');
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('token');
    });
});
