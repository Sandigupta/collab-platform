import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { ColumnController } from '../controllers/column.controller';
import { TaskController } from '../controllers/task.controller';
import { verifyToken } from '../middleware/auth';

export const activityRouter = Router();

// Note: Most activity routes are nested under /boards/:boardId
// This router mounts at /activities but we also add board-nested routes here

// We add board-nested routes to the board router via app.ts
// For now, this is a standalone activities endpoint
