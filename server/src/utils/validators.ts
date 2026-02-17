import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

export const createBoardSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    backgroundImage: z.string().optional(),
});

export const createColumnSchema = z.object({
    boardId: z.string().uuid('Invalid board ID'),
    title: z.string().min(1, 'Title is required'),
});

export const updateColumnSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    position: z.number().int().min(0).optional(),
});

export const createTaskSchema = z.object({
    columnId: z.string().uuid('Invalid column ID'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    columnId: z.string().uuid().optional(),
    position: z.number().int().min(0).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().optional(),
});

export const createChecklistSchema = z.object({
    title: z.string().min(1, 'Title is required'),
});

export const updateChecklistSchema = z.object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
});

export const createCommentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty'),
});
