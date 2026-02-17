import { create } from 'zustand';
import type { User } from '../types';
import api from '../services/api';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.data.token);
            set({ user: data.data.user, isLoading: false });
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Login failed';
            set({ error: msg, isLoading: false });
        }
    },

    signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/signup', { name, email, password });
            localStorage.setItem('token', data.data.token);
            set({ user: data.data.user, isLoading: false });
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Signup failed';
            set({ error: msg, isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
    },

    checkSession: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isLoading: false });
            return;
        }
        set({ isLoading: true });
        try {
            const { data } = await api.get('/auth/me');
            set({ user: data.data, isLoading: false });
        } catch (error) {
            localStorage.removeItem('token');
            set({ isLoading: false });
        }
    }
}));
