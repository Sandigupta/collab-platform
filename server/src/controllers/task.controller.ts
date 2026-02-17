import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { ActivityService } from '../services/activity.service';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export class TaskController {
    static async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const boardId = req.params.boardId as string;
            const { search, cursor, limit } = req.query;
            const result = await TaskService.getTasks(
                boardId,
                search as string | undefined,
                cursor as string | undefined,
                limit ? parseInt(limit as string) : 100
            );
            res.json({ success: true, ...result });
        } catch (error) { next(error); }
    }

    static async createTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { columnId, title, description, priority } = req.body;
            const task = await TaskService.createTask(columnId, title, description, priority);

            // Log activity
            const column = await prisma.column.findUnique({ where: { id: columnId } });
            if (column) {
                await ActivityService.logActivity(column.boardId, req.userId!, `created task "${title}"`, 'HISTORY', task.id);
            }

            res.status(201).json({ success: true, data: task });
        } catch (error) { next(error); }
    }

    static async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const taskBefore = await prisma.task.findUnique({
                where: { id: req.params.id as string },
                include: { column: true }
            });
            const task = await TaskService.updateTask(req.params.id as string, req.body);

            // Log activity for meaningful updates
            if (taskBefore) {
                const changes: string[] = [];
                if (req.body.title && req.body.title !== taskBefore.title) changes.push(`renamed task to "${req.body.title}"`);
                if (req.body.description !== undefined && req.body.description !== taskBefore.description) changes.push('updated description');
                if (req.body.priority && req.body.priority !== taskBefore.priority) changes.push(`set priority to ${req.body.priority}`);
                if (req.body.completed !== undefined && req.body.completed !== taskBefore.completed) {
                    changes.push(req.body.completed ? 'marked task as complete' : 'marked task as incomplete');
                }
                if (req.body.dueDate !== undefined) changes.push('updated due date');

                for (const action of changes) {
                    await ActivityService.logActivity(taskBefore.column.boardId, req.userId!, action, 'HISTORY', task.id);
                }
            }

            res.json({ success: true, data: task });
        } catch (error) { next(error); }
    }

    static async moveTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { columnId, position } = req.body;
            const task = await TaskService.moveTask(req.params.id as string, columnId, position);

            // Log activity
            const column = await prisma.column.findUnique({ where: { id: columnId } });
            if (column) {
                await ActivityService.logActivity(column.boardId, req.userId!, `moved task "${task.title}"`, 'HISTORY', task.id);
            }

            res.json({ success: true, data: task });
        } catch (error) { next(error); }
    }

    static async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Get task info before deleting for activity log
            const task = await prisma.task.findUnique({
                where: { id: req.params.id as string },
                include: { column: true }
            });

            await TaskService.deleteTask(req.params.id as string);

            // Log activity after deletion (taskId set to null via onDelete: SetNull)
            if (task) {
                await ActivityService.logActivity(task.column.boardId, req.userId!, `deleted task "${task.title}"`, 'HISTORY');
            }

            res.json({ success: true, message: 'Task deleted' });
        } catch (error) { next(error); }
    }

    static async assignUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            await TaskService.assignUser(req.params.id as string, userId);

            // Log activity
            const task = await prisma.task.findUnique({
                where: { id: req.params.id as string },
                include: { column: true }
            });
            if (task) {
                const assignedUser = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
                await ActivityService.logActivity(
                    task.column.boardId, req.userId!,
                    `assigned ${assignedUser?.name || 'a user'} to task "${task.title}"`,
                    'HISTORY', task.id
                );
            }

            res.json({ success: true, message: 'User assigned' });
        } catch (error) { next(error); }
    }

    static async unassignUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            await TaskService.unassignUser(req.params.id as string, userId);

            // Log activity
            const task = await prisma.task.findUnique({
                where: { id: req.params.id as string },
                include: { column: true }
            });
            if (task) {
                const unassignedUser = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
                await ActivityService.logActivity(
                    task.column.boardId, req.userId!,
                    `unassigned ${unassignedUser?.name || 'a user'} from task "${task.title}"`,
                    'HISTORY', task.id
                );
            }

            res.json({ success: true, message: 'User unassigned' });
        } catch (error) { next(error); }
    }
}
