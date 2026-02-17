import prisma from '../config/db';
import { ActivityType } from '@prisma/client';

export class ActivityService {
    static async getActivities(boardId: string, cursor?: string, limit: number = 30) {
        const queryOptions: any = {
            where: { boardId },
            take: limit + 1,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true, avatar: true } },
            },
        };

        if (cursor) {
            queryOptions.cursor = { id: cursor };
            queryOptions.skip = 1;
        }

        const activities = await prisma.activity.findMany(queryOptions);

        let nextCursor: string | null = null;
        if (activities.length > limit) {
            const nextItem = activities.pop();
            nextCursor = nextItem!.id;
        }

        return { data: activities, nextCursor };
    }

    static async logActivity(boardId: string, userId: string, action: string, type: ActivityType = 'HISTORY', taskId?: string) {
        return prisma.activity.create({
            data: { boardId, userId, action, type, taskId },
            include: {
                user: { select: { id: true, name: true, email: true, avatar: true } },
            },
        });
    }

    static async addComment(boardId: string, taskId: string, userId: string, content: string) {
        return prisma.activity.create({
            data: {
                boardId,
                taskId,
                userId,
                action: content,
                type: 'COMMENT',
            },
            include: {
                user: { select: { id: true, name: true, email: true, avatar: true } },
            },
        });
    }
}
