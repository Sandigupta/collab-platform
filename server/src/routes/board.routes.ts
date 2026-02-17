import { Router } from 'express';
import { BoardController } from '../controllers/board.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBoardSchema } from '../utils/validators';

export const boardRouter = Router();

boardRouter.use(verifyToken);

boardRouter.get('/', BoardController.getBoards);
boardRouter.get('/:id', BoardController.getBoardById);
boardRouter.post('/', validate(createBoardSchema), BoardController.createBoard);
boardRouter.post('/:id/members', BoardController.addMember);
boardRouter.delete('/:id/members/:userId', BoardController.removeMember);
boardRouter.delete('/:id', BoardController.deleteBoard);
