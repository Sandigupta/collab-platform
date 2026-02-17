import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { emitToBoard } from '../sockets';

export class ColumnService {
    static async getColumns(boardId: string) {
        return prisma.column.findMany({
            where: { boardId },
            orderBy: { position: 'asc' },
        });
    }

    static async createColumn(boardId: string, title: string) {
        // Get next position
        const maxPos = await prisma.column.aggregate({
            where: { boardId },
            _max: { position: true },
        });
        const position = (maxPos._max.position ?? -1) + 1;

        const column = await prisma.column.create({
            data: { boardId, title, position },
        });

        emitToBoard(boardId, 'column:created', column);
        return column;
    }

    static async updateColumn(columnId: string, data: { title?: string; position?: number }) {
        const column = await prisma.column.findUnique({ where: { id: columnId } });
        if (!column) throw new AppError('Column not found', 404, 'COLUMN_NOT_FOUND');

        const updated = await prisma.column.update({
            where: { id: columnId },
            data,
        });

        emitToBoard(column.boardId, 'column:updated', updated);
        return updated;
    }

    static async deleteColumn(columnId: string) {
        const column = await prisma.column.findUnique({ where: { id: columnId } });
        if (!column) throw new AppError('Column not found', 404, 'COLUMN_NOT_FOUND');

        await prisma.column.delete({ where: { id: columnId } });

        emitToBoard(column.boardId, 'column:deleted', { columnId, boardId: column.boardId });
    }

    static async reorderColumns(boardId: string, columnIds: string[]) {
        const updates = columnIds.map((id, index) =>
            prisma.column.update({ where: { id }, data: { position: index } })
        );
        await prisma.$transaction(updates);

        // Fetch updated columns and emit
        const columns = await prisma.column.findMany({
            where: { boardId },
            orderBy: { position: 'asc' },
        });
        emitToBoard(boardId, 'column:reordered', { boardId, columns });
    }
}
