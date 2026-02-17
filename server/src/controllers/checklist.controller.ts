import { Response, NextFunction } from 'express';
import { ChecklistService } from '../services/checklist.service';
import { AuthRequest } from '../middleware/auth';

export class ChecklistController {
    static async createItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const item = await ChecklistService.createItem(req.params.taskId as string, req.body.title);
            res.status(201).json({ success: true, data: item });
        } catch (error) { next(error); }
    }

    static async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const item = await ChecklistService.updateItem(req.params.id as string, req.body);
            res.json({ success: true, data: item });
        } catch (error) { next(error); }
    }

    static async deleteItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await ChecklistService.deleteItem(req.params.id as string);
            res.json({ success: true, message: 'Item deleted' });
        } catch (error) { next(error); }
    }
}
