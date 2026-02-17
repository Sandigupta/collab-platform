import { create } from 'zustand';
import type { Activity } from '../types';
import { normalizeActivity } from '../types';
import api from '../services/api';

interface ActivityState {
    activities: Activity[];
    isLoading: boolean;
    nextCursor: string | null;
    hasMore: boolean;
    fetchActivities: (boardId: string) => Promise<void>;
    loadMoreActivities: (boardId: string) => Promise<void>;
    logActivity: (boardId: string, userId: string, action: string, type?: 'history' | 'comment', taskId?: string) => Promise<void>;
    addComment: (taskId: string, content: string) => Promise<void>;
    addActivityLocal: (activity: Activity) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
    activities: [],
    isLoading: false,
    nextCursor: null,
    hasMore: false,

    fetchActivities: async (boardId) => {
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/boards/${boardId}/activities`);
            set({
                activities: data.data.map(normalizeActivity),
                nextCursor: data.nextCursor,
                hasMore: !!data.nextCursor,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    loadMoreActivities: async (boardId) => {
        const { nextCursor, isLoading } = get();
        if (!nextCursor || isLoading) return;

        set({ isLoading: true });
        try {
            const { data } = await api.get(`/boards/${boardId}/activities?cursor=${nextCursor}`);
            set((state) => ({
                activities: [...state.activities, ...data.data.map(normalizeActivity)],
                nextCursor: data.nextCursor,
                hasMore: !!data.nextCursor,
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
        }
    },

    logActivity: async (boardId, userId, action, type = 'history', taskId) => {
        // Optimistic local add for instant UI feedback
        const tempActivity: Activity = {
            id: crypto.randomUUID(),
            boardId,
            userId,
            action,
            type,
            taskId,
            timestamp: new Date().toISOString()
        };
        set((state) => ({ activities: [tempActivity, ...state.activities] }));

        // Persist to backend
        try {
            await api.post(`/boards/${boardId}/activities`, { action, type: type?.toUpperCase(), taskId });
        } catch (error) {
            // Activity logging is non-critical — don't break the UI on failure
            console.warn('Failed to persist activity:', error);
        }
    },

    addComment: async (taskId, content) => {
        const { data } = await api.post(`/tasks/${taskId}/comments`, { content });
        const comment = normalizeActivity(data.data);
        set((state) => ({ activities: [comment, ...state.activities] }));
    },

    addActivityLocal: (activity: Activity) => {
        const normalized = normalizeActivity(activity);
        set((state) => {
            // Dedup
            if (state.activities.some(a => a.id === normalized.id)) return state;
            return { activities: [normalized, ...state.activities] };
        });
    }
}));
