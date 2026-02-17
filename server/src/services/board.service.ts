import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { emitToBoard } from '../sockets';

export class BoardService {
    static async getBoards(userId: string) {
        return prisma.board.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                _count: { select: { columns: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getBoardById(boardId: string, userId: string) {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                columns: { orderBy: { position: 'asc' } },
            },
        });

        if (!board) throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');

        // Check membership
        const isMember = board.ownerId === userId || board.members.some(m => m.userId === userId);
        if (!isMember) throw new AppError('Access denied', 403, 'BOARD_ACCESS_DENIED');

        return board;
    }

    static async createBoard(userId: string, title: string, backgroundImage?: string) {
        return prisma.board.create({
            data: {
                title,
                backgroundImage,
                ownerId: userId,
                members: { create: { userId } },
            },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
            },
        });
    }

    static async addMember(boardId: string, email: string, requesterId: string) {
        const board = await prisma.board.findUnique({ where: { id: boardId } });
        if (!board) throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');

        // Only owner can add members
        if (board.ownerId !== requesterId) {
            throw new AppError('Only the board owner can add members', 403, 'ADD_MEMBER_DENIED');
        }

        // Find user by email
        const userToAdd = await prisma.user.findUnique({ where: { email } });
        if (!userToAdd) throw new AppError('User not found with that email', 404, 'USER_NOT_FOUND');

        // Check if already a member
        const existing = await prisma.boardMember.findUnique({
            where: { boardId_userId: { boardId, userId: userToAdd.id } },
        });
        if (existing) throw new AppError('User is already a member of this board', 409, 'ALREADY_MEMBER');

        await prisma.boardMember.create({ data: { boardId, userId: userToAdd.id } });

        // Return updated board with members
        const updatedBoard = await prisma.board.findUnique({
            where: { id: boardId },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
            },
        });

        if (updatedBoard) {
            const newMember = updatedBoard.members.find(m => m.userId === userToAdd.id);
            emitToBoard(boardId, 'board:member_added', { boardId, member: newMember });
        }

        return updatedBoard;
    }

    static async removeMember(boardId: string, userIdToRemove: string, requesterId: string) {
        const board = await prisma.board.findUnique({ where: { id: boardId } });
        if (!board) throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');

        // Only owner can remove members (and owner can't remove themselves)
        if (board.ownerId !== requesterId) {
            throw new AppError('Only the board owner can remove members', 403, 'REMOVE_MEMBER_DENIED');
        }
        if (board.ownerId === userIdToRemove) {
            throw new AppError('Board owner cannot be removed', 400, 'CANNOT_REMOVE_OWNER');
        }

        await prisma.boardMember.delete({
            where: { boardId_userId: { boardId, userId: userIdToRemove } },
        });

        // Also remove any task assignments for this user on this board
        const columns = await prisma.column.findMany({ where: { boardId }, select: { id: true } });
        const columnIds = columns.map(c => c.id);
        const tasks = await prisma.task.findMany({ where: { columnId: { in: columnIds } }, select: { id: true } });
        const taskIds = tasks.map(t => t.id);

        if (taskIds.length > 0) {
            await prisma.taskAssignment.deleteMany({
                where: { taskId: { in: taskIds }, userId: userIdToRemove },
            });
        }

        emitToBoard(boardId, 'board:member_removed', { boardId, userId: userIdToRemove });
    }

    static async deleteBoard(boardId: string, userId: string) {
        const board = await prisma.board.findUnique({ where: { id: boardId } });
        if (!board) throw new AppError('Board not found', 404, 'BOARD_NOT_FOUND');
        if (board.ownerId !== userId) throw new AppError('Only the owner can delete this board', 403, 'BOARD_DELETE_DENIED');

        await prisma.board.delete({ where: { id: boardId } });

        emitToBoard(boardId, 'board:deleted', { boardId });
    }
}
