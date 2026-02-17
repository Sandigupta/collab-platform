import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { Priority } from '@prisma/client';
import { emitToBoard } from '../sockets';

export class TaskService {
    static async getTasks(boardId: string, search?: string, cursor?: string, limit: number = 20) {
        // Get column IDs for this board
        const columns = await prisma.column.findMany({
            where: { boardId },
            select: { id: true },
        });
        const columnIds = columns.map(c => c.id);

        const where: any = { columnId: { in: columnIds } };

        // Full-text search on title
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        // Cursor-based pagination
        const queryOptions: any = {
            where,
            take: limit + 1, // fetch one extra to determine if there's a next page
            orderBy: [{ columnId: 'asc' }, { position: 'asc' }],
            include: {
                assignments: {
                    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
                },
                checklists: true,
            },
        };

        if (cursor) {
            queryOptions.cursor = { id: cursor };
            queryOptions.skip = 1; // skip the cursor itself
        }

        const tasks = await prisma.task.findMany(queryOptions);

        let nextCursor: string | null = null;
        if (tasks.length > limit) {
            const nextItem = tasks.pop();
            nextCursor = nextItem!.id;
        }

        return { data: tasks, nextCursor };
    }

    static async createTask(columnId: string, title: string, description?: string, priority?: Priority) {
        const column = await prisma.column.findUnique({ where: { id: columnId } });
        if (!column) throw new AppError('Column not found', 404, 'COLUMN_NOT_FOUND');

        // Get next position
        const maxPos = await prisma.task.aggregate({
            where: { columnId },
            _max: { position: true },
        });
        const position = (maxPos._max.position ?? -1) + 1;

        const newTask = await prisma.task.create({
            data: { columnId, title, description, priority: priority || 'MEDIUM', position },
            include: {
                assignments: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                checklists: true,
            },
        });

        emitToBoard(column.boardId, 'task:created', newTask);
        return newTask;
    }

    static async updateTask(taskId: string, data: Partial<{
        title: string;
        description: string;
        columnId: string;
        position: number;
        priority: Priority;
        completed: boolean;
        dueDate: string;
    }>) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { column: true }
        });
        if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

        const updateData: any = { ...data };
        if (data.dueDate) updateData.dueDate = new Date(data.dueDate);

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
            include: {
                assignments: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                checklists: true,
            },
        });

        emitToBoard(task.column.boardId, 'task:updated', updatedTask);
        return updatedTask;
    }

    static async moveTask(taskId: string, newColumnId: string, newPosition: number) {
        const taskToCheck = await prisma.task.findUnique({
            where: { id: taskId },
            include: { column: true }
        });
        if (!taskToCheck) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
        const boardId = taskToCheck.column.boardId;

        const result = await prisma.$transaction(async (tx) => {
            const task = await tx.task.findUnique({ where: { id: taskId } });
            if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

            // Update positions in old column
            await tx.task.updateMany({
                where: { columnId: task.columnId, position: { gt: task.position } },
                data: { position: { decrement: 1 } },
            });

            // Make room in new column
            await tx.task.updateMany({
                where: { columnId: newColumnId, position: { gte: newPosition } },
                data: { position: { increment: 1 } },
            });

            // Move the task
            return tx.task.update({
                where: { id: taskId },
                data: { columnId: newColumnId, position: newPosition },
                include: {
                    assignments: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                    checklists: true,
                },
            });
        });

        emitToBoard(boardId, 'task:moved', { taskId, newColumnId, newPosition, task: result });
        return result;
    }

    static async deleteTask(taskId: string) {
        const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: true } });
        if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

        await prisma.task.delete({ where: { id: taskId } });

        emitToBoard(task.column.boardId, 'task:deleted', { taskId, boardId: task.column.boardId });
    }

    static async assignUser(taskId: string, userId: string) {
        const assignment = await prisma.taskAssignment.create({
            data: { taskId, userId },
        });

        const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: true, assignments: { include: { user: true } } } });
        if (task) {
            emitToBoard(task.column.boardId, 'task:updated', task);
        }

        return assignment;
    }

    static async unassignUser(taskId: string, userId: string) {
        await prisma.taskAssignment.delete({
            where: { taskId_userId: { taskId, userId } },
        });

        const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: true, assignments: { include: { user: true } } } });
        if (task) {
            emitToBoard(task.column.boardId, 'task:updated', task);
        }
    }
}
