import { Router } from 'express';
import { ColumnController } from '../controllers/column.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createColumnSchema, updateColumnSchema } from '../utils/validators';

export const columnRouter = Router();

columnRouter.use(verifyToken);

// GET columns is on the board route: /boards/:boardId/columns  
// But we also support /columns for direct CRUD
columnRouter.post('/', validate(createColumnSchema), ColumnController.createColumn);
columnRouter.patch('/:id', validate(updateColumnSchema), ColumnController.updateColumn);
columnRouter.delete('/:id', ColumnController.deleteColumn);
columnRouter.post('/reorder', ColumnController.reorderColumns);
