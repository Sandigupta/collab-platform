import { Router } from 'express';
import { ChecklistController } from '../controllers/checklist.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateChecklistSchema } from '../utils/validators';

export const checklistRouter = Router();

checklistRouter.use(verifyToken);

checklistRouter.patch('/:id', validate(updateChecklistSchema), ChecklistController.updateItem);
checklistRouter.delete('/:id', ChecklistController.deleteItem);
