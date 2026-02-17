import type { Board, Column, Task, User, Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock Data
const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Demo User', email: 'demo@test.com', avatar: 'https://ui-avatars.com/api/?name=Demo+User' },
    { id: 'u2', name: 'Alice Smith', email: 'alice@test.com', avatar: 'https://ui-avatars.com/api/?name=Alice+Smith' },
    { id: 'u3', name: 'Bob Jones', email: 'bob@test.com', avatar: 'https://ui-avatars.com/api/?name=Bob+Jones' },
];

let boards: Board[] = [
    { id: 'b1', title: 'Product Launch', createdAt: new Date().toISOString(), members: ['u1', 'u2'], backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' },
    { id: 'b2', title: 'Marketing Campaign', createdAt: new Date().toISOString(), members: ['u1', 'u3'], backgroundImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80' },
];

let columns: Column[] = [
    { id: 'c1', boardId: 'b1', title: 'To Do', position: 0 },
    { id: 'c2', boardId: 'b1', title: 'In Progress', position: 1 },
    { id: 'c3', boardId: 'b1', title: 'Done', position: 2 },
    { id: 'c4', boardId: 'b2', title: 'Ideas', position: 0 },
];

let tasks: Task[] = [
    { id: 't1', columnId: 'c1', title: 'Research Competitors', description: 'Analyze top 3 competitors.', assignedUsers: ['u1'], createdAt: new Date().toISOString(), position: 0, priority: 'high', labels: ['Strategy'], completed: false },
    { id: 't2', columnId: 'c1', title: 'Draft PRD', description: 'Write the initial requirements.', assignedUsers: ['u2'], createdAt: new Date().toISOString(), position: 1, priority: 'medium', labels: ['Product'], completed: true },
    { id: 't3', columnId: 'c2', title: 'Design Mockups', description: 'Create Figma designs.', assignedUsers: ['u1'], createdAt: new Date().toISOString(), position: 0, priority: 'high', labels: ['Design'], completed: false },
];

let activities: Activity[] = [];

const LATENCY = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    // Auth
    login: async (email: string, password: string): Promise<User> => {
        await delay(LATENCY);
        if (email === 'demo@test.com' && password === '123456') {
            return MOCK_USERS[0];
        }
        throw new Error('Invalid credentials');
    },

    getCurrentUser: async (): Promise<User | null> => {
        await delay(LATENCY);
        return MOCK_USERS[0]; // Simulate persistent session for now
    },

    // Boards
    getBoards: async (): Promise<Board[]> => {
        await delay(LATENCY);
        return [...boards];
    },

    getBoardById: async (boardId: string): Promise<Board | undefined> => {
        await delay(LATENCY);
        return boards.find(b => b.id === boardId);
    },

    createBoard: async (title: string, backgroundImage?: string): Promise<Board> => {
        await delay(LATENCY);
        const newBoard: Board = {
            id: uuidv4(),
            title,
            createdAt: new Date().toISOString(),
            members: ['u1'], // Creator
            backgroundImage
        };
        boards = [...boards, newBoard];
        return newBoard;
    },

    // Columns
    getColumns: async (boardId: string): Promise<Column[]> => {
        await delay(LATENCY);
        return columns.filter(c => c.boardId === boardId).sort((a, b) => a.position - b.position);
    },

    createColumn: async (boardId: string, title: string): Promise<Column> => {
        await delay(LATENCY);
        const newColumn: Column = {
            id: uuidv4(),
            boardId,
            title,
            position: columns.filter(c => c.boardId === boardId).length
        };
        columns = [...columns, newColumn];
        return newColumn;
    },

    updateColumn: async (columnId: string, title: string): Promise<Column> => {
        await delay(LATENCY);
        const column = columns.find(c => c.id === columnId);
        if (!column) throw new Error('Column not found');
        column.title = title;
        return column;
    },

    deleteColumn: async (columnId: string): Promise<void> => {
        await delay(LATENCY);
        columns = columns.filter(c => c.id !== columnId);
        tasks = tasks.filter(t => t.columnId !== columnId);
    },

    // Tasks
    getTasks: async (boardId: string): Promise<Task[]> => {
        await delay(LATENCY);
        // Find all columns for this board
        const boardColumnIds = columns.filter(c => c.boardId === boardId).map(c => c.id);
        return tasks.filter(t => boardColumnIds.includes(t.columnId)).sort((a, b) => a.position - b.position);
    },

    createTask: async (columnId: string, title: string, description?: string): Promise<Task> => {
        await delay(LATENCY);
        const newTask: Task = {
            id: uuidv4(),
            columnId,
            title,
            description,
            assignedUsers: [],
            createdAt: new Date().toISOString(),
            position: tasks.filter(t => t.columnId === columnId).length,
            completed: false,
        };
        tasks = [...tasks, newTask];
        return newTask;
    },

    updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
        await delay(LATENCY);
        tasks = tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t));
        return tasks.find(t => t.id === taskId)!;
    },

    deleteTask: async (taskId: string): Promise<void> => {
        await delay(LATENCY);
        tasks = tasks.filter(t => t.id !== taskId);
    },

    // Activity
    logActivity: async (boardId: string, userId: string, action: string): Promise<Activity> => {
        await delay(LATENCY); // optional delay
        const newActivity: Activity = {
            id: crypto.randomUUID(),
            boardId,
            userId,
            action,
            type: 'history',
            timestamp: new Date().toISOString()
        };
        activities = [newActivity, ...activities];
        return newActivity;
    },

    getActivities: async (boardId: string): Promise<Activity[]> => {
        await delay(LATENCY);
        return activities.filter(a => a.boardId === boardId);
    }
};
