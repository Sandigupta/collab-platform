import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Task Limits & Pagination', () => {
    let token: string;
    let boardId: string;
    let columnId: string;

    beforeAll(async () => {
        // Setup: Create User, Board, Column
        await prisma.user.deleteMany({ where: { email: 'limit-test@example.com' } });

        const userRes = await request(app).post('/auth/signup').send({
            name: 'Limit Tester',
            email: 'limit-test@example.com',
            password: 'password123'
        });
        token = userRes.body.data.token;

        const boardRes = await request(app)
            .post('/boards')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Limit Test Board', backgroundImage: 'bg-1' });

        if (!boardRes.body.success) {
            throw new Error(`Failed to create board: ${JSON.stringify(boardRes.body)}`);
        }
        boardId = boardRes.body.data.id;

        const colRes = await request(app)
            .post('/columns')
            .set('Authorization', `Bearer ${token}`)
            .send({ boardId, title: 'ToDo' });
        columnId = colRes.body.data.id;
    }, 30000);

    afterAll(async () => {
        await prisma.task.deleteMany({ where: { column: { boardId } } });
        await prisma.column.deleteMany({ where: { boardId } });
        await prisma.board.deleteMany({ where: { id: boardId } });
        await prisma.user.deleteMany({ where: { email: 'limit-test@example.com' } });
        await prisma.$disconnect();
    });

    it('should fetch more than 20 tasks (default limit check)', async () => {
        // Create 25 tasks
        const tasks = Array.from({ length: 25 }, (_, i) => ({
            columnId,
            title: `Task ${i}`,
            position: i
        }));

        await prisma.task.createMany({ data: tasks });

        const res = await request(app)
            .get(`/boards/${boardId}/tasks`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        // Should return all 25, proving the limit > 20
        expect(res.body.data.length).toBeGreaterThanOrEqual(25);
    }, 30000); // 30s timeout
});
