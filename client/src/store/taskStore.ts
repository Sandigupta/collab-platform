import { create } from 'zustand';
import type { Task } from '../types';
import { normalizeTask } from '../types';
import api from '../services/api';
import { useActivityStore } from './activityStore';
import { useAuthStore } from './authStore';
import { useBoardStore } from './boardStore';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    fetchTasks: (boardId: string) => Promise<void>;
    createTask: (columnId: string, title: string, description?: string) => Promise<void>;
    moveTask: (taskId: string, newColumnId: string, newPosition: number) => Promise<void>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    addChecklistItem: (taskId: string, title: string) => Promise<void>;
    toggleChecklistItem: (taskId: string, itemId: string) => Promise<void>;
    reorderTasks: (columnId: string, newOrder: string[]) => void;
    assignUser: (taskId: string, userId: string) => Promise<void>;
    unassignUser: (taskId: string, userId: string) => Promise<void>;
    // Local-only methods for socket events (no API calls)
    addTaskLocal: (task: Task) => void;
    updateTaskLocal: (taskId: string, task: Task) => void;
    removeTaskLocal: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,

    fetchTasks: async (boardId) => {
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/boards/${boardId}/tasks`);
            set({ tasks: data.data.map(normalizeTask), isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    createTask: async (columnId, title, description) => {
        const tempId = crypto.randomUUID();
        const newTask: Task = {
            id: tempId,
            columnId,
            title,
            description,
            position: 9999, // Append to end temporarily
            priority: 'medium',
            checklists: [],
            assignedUsers: [],
            dueDate: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Optimistic add
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        try {
            const { data } = await api.post('/tasks', { columnId, title, description });
            const confirmedTask = normalizeTask(data.data);

            // Replace temp task with real one
            set((state) => ({
                tasks: state.tasks.map(t => t.id === tempId ? confirmedTask : t)
            }));

            // Log activity
            const user = useAuthStore.getState().user;
            if (user) {
                const boardId = useBoardStore.getState().columns.find(c => c.id === columnId)?.boardId;
                if (boardId) {
                    useActivityStore.getState().logActivity(boardId, user.id, `created task "${title}"`);
                }
            }
        } catch (error) {
            // Revert on error
            set((state) => ({ tasks: state.tasks.filter(t => t.id !== tempId) }));
        }
    },

    moveTask: async (taskId, newColumnId, newPosition) => {
        // Optimistic update
        set((state) => {
            const updatedTasks = state.tasks.map(t => {
                if (t.id === taskId) {
                    return { ...t, columnId: newColumnId, position: newPosition };
                }
                return t;
            });
            return { tasks: updatedTasks };
        });

        try {
            await api.patch(`/tasks/${taskId}/move`, { columnId: newColumnId, position: newPosition });
        } catch (error) {
            // Revert on error — refetch
            const boardId = useBoardStore.getState().currentBoard?.id;
            if (boardId) get().fetchTasks(boardId);
        }
    },

    updateTask: async (taskId, updates) => {
        const previousTasks = get().tasks;

        // Optimistic update
        set((state) => ({
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
        }));

        try {
            const { data } = await api.patch(`/tasks/${taskId}`, updates);
            const updatedTask = normalizeTask(data.data);
            // Confirm update (in case server sanitized something)
            set((state) => ({ tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t) }));
        } catch (error) {
            // Revert
            set({ tasks: previousTasks });
        }
    },

    deleteTask: async (taskId) => {
        await api.delete(`/tasks/${taskId}`);
        set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId) }));
    },

    addChecklistItem: async (taskId, title) => {
        const { data } = await api.post(`/tasks/${taskId}/checklist`, { title });
        const newItem = data.data;
        set((state) => ({
            tasks: state.tasks.map(t => {
                if (t.id === taskId) {
                    const existingChecklist = t.checklists || [];
                    return { ...t, checklists: [...existingChecklist, newItem] };
                }
                return t;
            })
        }));
    },

    toggleChecklistItem: async (taskId, itemId) => {
        const task = get().tasks.find(t => t.id === taskId);
        const item = task?.checklists?.find(i => i.id === itemId);
        if (!item) return;

        // Optimistic
        set((state) => ({
            tasks: state.tasks.map(t => {
                if (t.id === taskId && t.checklists) {
                    return {
                        ...t,
                        checklists: t.checklists.map(ci =>
                            ci.id === itemId ? { ...ci, completed: !ci.completed } : ci
                        )
                    };
                }
                return t;
            })
        }));

        await api.patch(`/checklist/${itemId}`, { completed: !item.completed });
    },

    reorderTasks: (columnId: string, newOrder: string[]) => {
        set((state) => {
            const otherTasks = state.tasks.filter(t => t.columnId !== columnId);
            const columnTasks = state.tasks.filter(t => t.columnId === columnId);

            const reorderedTasks = newOrder.map((id, index) => {
                const task = columnTasks.find(t => t.id === id);
                if (task) {
                    return { ...task, position: index };
                }
                return null;
            }).filter((t): t is Task => t !== null);

            return { tasks: [...otherTasks, ...reorderedTasks] };
        });
    },

    assignUser: async (taskId, userId) => {
        set((state) => ({
            tasks: state.tasks.map(t => {
                if (t.id === taskId) {
                    const currentAssignees = t.assignedUsers || [];
                    if (currentAssignees.includes(userId)) return t;
                    return { ...t, assignedUsers: [...currentAssignees, userId] };
                }
                return t;
            })
        }));

        await api.post(`/tasks/${taskId}/assign`, { userId });

        const user = useAuthStore.getState().user;
        const boardId = useBoardStore.getState().currentBoard?.id;
        if (user && boardId) {
            useActivityStore.getState().logActivity(boardId, user.id, `assigned user to task`, 'history', taskId);
        }
    },

    unassignUser: async (taskId, userId) => {
        set((state) => ({
            tasks: state.tasks.map(t => {
                if (t.id === taskId) {
                    const currentAssignees = t.assignedUsers || [];
                    return { ...t, assignedUsers: currentAssignees.filter(id => id !== userId) };
                }
                return t;
            })
        }));

        await api.post(`/tasks/${taskId}/unassign`, { userId });

        const user = useAuthStore.getState().user;
        const boardId = useBoardStore.getState().currentBoard?.id;
        if (user && boardId) {
            useActivityStore.getState().logActivity(boardId, user.id, `unassigned user from task`, 'history', taskId);
        }
    },

    // === Local-only methods for socket events (no API calls) ===
    addTaskLocal: (task: Task) => {
        const normalized = normalizeTask(task);
        set((state) => {
            // Dedup: don't add if task already exists
            if (state.tasks.some(t => t.id === normalized.id)) return state;
            return { tasks: [...state.tasks, normalized] };
        });
    },

    updateTaskLocal: (taskId: string, task: Task) => {
        const normalized = normalizeTask(task);
        set((state) => ({
            tasks: state.tasks.map(t => t.id === taskId ? normalized : t)
        }));
    },

    removeTaskLocal: (taskId: string) => {
        set((state) => ({
            tasks: state.tasks.filter(t => t.id !== taskId)
        }));
    },
}));
