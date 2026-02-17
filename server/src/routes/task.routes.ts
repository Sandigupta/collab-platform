import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { ChecklistController } from '../controllers/checklist.controller';
import { ActivityController } from '../controllers/activity.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, createChecklistSchema, createCommentSchema } from '../utils/validators';

export const taskRouter = Router();

taskRouter.use(verifyToken);

taskRouter.post('/', validate(createTaskSchema), TaskController.createTask);
taskRouter.patch('/:id', validate(updateTaskSchema), TaskController.updateTask);
taskRouter.patch('/:id/move', TaskController.moveTask);
taskRouter.delete('/:id', TaskController.deleteTask);

// Assignment
taskRouter.post('/:id/assign', TaskController.assignUser);
taskRouter.post('/:id/unassign', TaskController.unassignUser);

// Checklist (nested under tasks)
taskRouter.post('/:taskId/checklist', validate(createChecklistSchema), ChecklistController.createItem);

// Comments (nested under tasks)
taskRouter.post('/:taskId/comments', validate(createCommentSchema), ActivityController.addComment);
