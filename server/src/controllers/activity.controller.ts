import { Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export class ActivityController {
    static async getActivities(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const boardId = req.params.boardId as string;
            const { cursor, limit } = req.query;
            const result = await ActivityService.getActivities(
                boardId,
                cursor as string | undefined,
                limit ? parseInt(limit as string) : 30
            );
            res.json({ success: true, ...result });
        } catch (error) { next(error); }
    }

    static async logActivity(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const boardId = req.params.boardId as string;
            const { action, type, taskId } = req.body;
            const activity = await ActivityService.logActivity(
                boardId,
                req.userId!,
                action,
                type || 'HISTORY',
                taskId
            );
            res.status(201).json({ success: true, data: activity });
        } catch (error) { next(error); }
    }

    static async addComment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { content } = req.body;
            const taskId = req.params.taskId as string;

            // Find boardId from task
            const task = await prisma.task.findUnique({
                where: { id: taskId },
                include: { column: true },
            });

            if (!task) {
                res.status(404).json({ success: false, message: 'Task not found', errorCode: 'TASK_NOT_FOUND' });
                return;
            }

            const activity = await ActivityService.addComment(task.column.boardId, taskId, req.userId!, content);
            res.status(201).json({ success: true, data: activity });
        } catch (error) { next(error); }
    }
}
