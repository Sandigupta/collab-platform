export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    createdAt?: string;
};

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type ChecklistItem = {
    id: string;
    title: string;
    completed: boolean;
    taskId?: string;
};

export type Task = {
    id: string;
    columnId: string;
    title: string;
    description?: string | null;
    assignedUsers: string[]; // User IDs (mapped from assignments)
    assignments?: { user: User }[]; // Raw from API
    createdAt: string;
    position: number;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'low' | 'medium' | 'high';
    dueDate?: string | null;
    labels?: string[];
    checklists?: ChecklistItem[];
    completed?: boolean;
    updatedAt?: string;
};

export type Column = {
    id: string;
    boardId: string;
    title: string;
    position: number;
    tasks?: Task[];
};

export type BoardMember = {
    id: string;
    userId: string;
    boardId: string;
    user: User;
};

export type Board = {
    id: string;
    title: string;
    createdAt: string;
    ownerId?: string;
    members: string[]; // User IDs for backward compatibility
    boardMembers?: BoardMember[]; // Raw from API
    backgroundImage?: string | null;
    _count?: { columns: number };
};

export type ActivityType = 'history' | 'comment' | 'HISTORY' | 'COMMENT';

export type Activity = {
    id: string;
    boardId: string;
    taskId?: string | null;
    userId: string;
    user?: User;
    type: ActivityType;
    action: string;
    timestamp: string;
    createdAt?: string;
};

// Helper to normalize backend data to frontend shapes
export function normalizeBoard(raw: any): Board {
    return {
        id: raw.id,
        title: raw.title,
        createdAt: raw.createdAt,
        ownerId: raw.ownerId,
        members: raw.members?.map((m: any) => m.userId || m) || [],
        boardMembers: raw.members,
        backgroundImage: raw.backgroundImage,
        _count: raw._count,
    };
}

export function normalizeTask(raw: any): Task {
    return {
        id: raw.id,
        columnId: raw.columnId,
        title: raw.title,
        description: raw.description,
        assignedUsers: raw.assignments?.map((a: any) => a.userId || a.user?.id) || raw.assignedUsers || [],
        assignments: raw.assignments,
        createdAt: raw.createdAt,
        position: raw.position,
        priority: raw.priority?.toLowerCase(),
        dueDate: raw.dueDate,
        checklists: raw.checklists,
        completed: raw.completed,
    };
}

export function normalizeActivity(raw: any): Activity {
    return {
        id: raw.id,
        boardId: raw.boardId,
        taskId: raw.taskId,
        userId: raw.userId,
        user: raw.user,
        type: raw.type?.toLowerCase() as ActivityType,
        action: raw.action,
        timestamp: raw.createdAt || raw.timestamp,
    };
}
