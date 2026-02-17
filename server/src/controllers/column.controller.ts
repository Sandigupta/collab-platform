import { Response, NextFunction } from 'express';
import { ColumnService } from '../services/column.service';
import { AuthRequest } from '../middleware/auth';

export class ColumnController {
    static async getColumns(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const columns = await ColumnService.getColumns(req.params.boardId as string);
            res.json({ success: true, data: columns });
        } catch (error) { next(error); }
    }

    static async createColumn(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { boardId, title } = req.body;
            const column = await ColumnService.createColumn(boardId, title);
            res.status(201).json({ success: true, data: column });
        } catch (error) { next(error); }
    }

    static async updateColumn(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const column = await ColumnService.updateColumn(req.params.id as string, req.body);
            res.json({ success: true, data: column });
        } catch (error) { next(error); }
    }

    static async deleteColumn(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await ColumnService.deleteColumn(req.params.id as string);
            res.json({ success: true, message: 'Column deleted' });
        } catch (error) { next(error); }
    }

    static async reorderColumns(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { boardId, columnIds } = req.body;
            await ColumnService.reorderColumns(boardId, columnIds);
            res.json({ success: true, message: 'Columns reordered' });
        } catch (error) { next(error); }
    }
}
