import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { emitToBoard } from '../sockets';

export class ChecklistService {
    static async createItem(taskId: string, title: string) {
        const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: true } });
        if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

        const item = await prisma.checklistItem.create({
            data: { taskId, title },
        });

        // Emit the full updated task so other users see checklist changes
        const updatedTask = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignments: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                checklists: true,
            },
        });
        if (updatedTask) {
            emitToBoard(task.column.boardId, 'task:updated', updatedTask);
        }

        return item;
    }

    static async updateItem(itemId: string, data: { title?: string; completed?: boolean }) {
        const item = await prisma.checklistItem.findUnique({
            where: { id: itemId },
            include: { task: { include: { column: true } } },
        });
        if (!item) throw new AppError('Checklist item not found', 404, 'CHECKLIST_NOT_FOUND');

        const updated = await prisma.checklistItem.update({
            where: { id: itemId },
            data,
        });

        // Emit the full updated task
        const updatedTask = await prisma.task.findUnique({
            where: { id: item.taskId },
            include: {
                assignments: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                checklists: true,
            },
        });
        if (updatedTask && item.task) {
            emitToBoard(item.task.column.boardId, 'task:updated', updatedTask);
        }

        return updated;
    }

    static async deleteItem(itemId: string) {
        const item = await prisma.checklistItem.findUnique({
            where: { id: itemId },
            include: { task: { include: { column: true } } },
        });
        if (!item) throw new AppError('Checklist item not found', 404, 'CHECKLIST_NOT_FOUND');

        await prisma.checklistItem.delete({ where: { id: itemId } });

        // Emit the full updated task
        const updatedTask = await prisma.task.findUnique({
            where: { id: item.taskId },
            include: {
                assignments: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                checklists: true,
            },
        });
        if (updatedTask && item.task) {
            emitToBoard(item.task.column.boardId, 'task:updated', updatedTask);
        }
    }
}
