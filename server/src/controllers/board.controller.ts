import { Response, NextFunction } from 'express';
import { BoardService } from '../services/board.service';
import { AuthRequest } from '../middleware/auth';

export class BoardController {
    static async getBoards(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const boards = await BoardService.getBoards(req.userId!);
            res.json({ success: true, data: boards });
        } catch (error) { next(error); }
    }

    static async getBoardById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const board = await BoardService.getBoardById(req.params.id as string, req.userId!);
            res.json({ success: true, data: board });
        } catch (error) { next(error); }
    }

    static async createBoard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { title, backgroundImage } = req.body;
            const board = await BoardService.createBoard(req.userId!, title, backgroundImage);
            res.status(201).json({ success: true, data: board });
        } catch (error) { next(error); }
    }

    static async addMember(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const board = await BoardService.addMember(req.params.id as string, email, req.userId!);
            res.json({ success: true, data: board });
        } catch (error) { next(error); }
    }

    static async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await BoardService.removeMember(req.params.id as string, req.params.userId as string, req.userId!);
            res.json({ success: true, message: 'Member removed' });
        } catch (error) { next(error); }
    }

    static async deleteBoard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await BoardService.deleteBoard(req.params.id as string, req.userId!);
            res.json({ success: true, message: 'Board deleted' });
        } catch (error) { next(error); }
    }
}
