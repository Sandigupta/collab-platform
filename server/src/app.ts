import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { verifyToken } from './middleware/auth';
import { authRouter } from './routes/auth.routes';
import { boardRouter } from './routes/board.routes';
import { columnRouter } from './routes/column.routes';
import { taskRouter } from './routes/task.routes';
import { checklistRouter } from './routes/checklist.routes';
import { ColumnController } from './controllers/column.controller';
import { TaskController } from './controllers/task.controller';
import { ActivityController } from './controllers/activity.controller';

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRouter);
app.use('/boards', boardRouter);
app.use('/columns', columnRouter);
app.use('/tasks', taskRouter);
app.use('/checklist', checklistRouter);

// Nested board routes (per PRD contract)
app.get('/boards/:boardId/columns', verifyToken, ColumnController.getColumns);
app.get('/boards/:boardId/tasks', verifyToken, TaskController.getTasks);
app.get('/boards/:boardId/activities', verifyToken, ActivityController.getActivities);
app.post('/boards/:boardId/activities', verifyToken, ActivityController.logActivity);

// Global error handler
app.use(errorHandler);

export default app;
