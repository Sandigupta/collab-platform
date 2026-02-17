import { create } from 'zustand';
import type { Board, Column } from '../types';
import { normalizeBoard } from '../types';
import api from '../services/api';

interface BoardState {
    boards: Board[];
    currentBoard: Board | null;
    columns: Column[];
    isLoading: boolean;
    fetchBoards: () => Promise<void>;
    fetchBoardData: (boardId: string) => Promise<void>;
    createBoard: (title: string, backgroundImage: string) => Promise<void>;
    createColumn: (boardId: string, title: string) => Promise<void>;
    updateColumn: (columnId: string, title: string) => Promise<void>;
    deleteColumn: (columnId: string) => Promise<void>;
    moveColumn: (activeId: string, overId: string) => Promise<void>;
    addMember: (boardId: string, email: string) => Promise<void>;
    removeMember: (boardId: string, userId: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set) => ({
    boards: [],
    currentBoard: null,
    columns: [],
    isLoading: false,

    fetchBoards: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/boards');
            set({ boards: data.data.map(normalizeBoard), isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    fetchBoardData: async (boardId) => {
        set({ isLoading: true });
        try {
            const [boardRes, columnsRes] = await Promise.all([
                api.get(`/boards/${boardId}`),
                api.get(`/boards/${boardId}/columns`),
            ]);
            set({
                currentBoard: normalizeBoard(boardRes.data.data),
                columns: columnsRes.data.data,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    createBoard: async (title, backgroundImage) => {
        const { data } = await api.post('/boards', { title, backgroundImage });
        const newBoard = normalizeBoard(data.data);
        set((state) => ({ boards: [...state.boards, newBoard] }));
    },

    createColumn: async (boardId, title) => {
        const { data } = await api.post('/columns', { boardId, title });
        set((state) => ({ columns: [...state.columns, data.data] }));
    },

    updateColumn: async (columnId, title) => {
        const { data } = await api.patch(`/columns/${columnId}`, { title });
        set((state) => ({
            columns: state.columns.map((col) => (col.id === columnId ? data.data : col)),
        }));
    },

    deleteColumn: async (columnId) => {
        await api.delete(`/columns/${columnId}`);
        set((state) => ({ columns: state.columns.filter(c => c.id !== columnId) }));
    },

    moveColumn: async (activeId: string, overId: string) => {
        set((state) => {
            const oldIndex = state.columns.findIndex((c) => c.id === activeId);
            const newIndex = state.columns.findIndex((c) => c.id === overId);
            if (oldIndex === -1 || newIndex === -1) return state;

            const newColumns = [...state.columns];
            const [movedColumn] = newColumns.splice(oldIndex, 1);
            newColumns.splice(newIndex, 0, movedColumn);

            // Persist reorder to backend
            api.post('/columns/reorder', {
                boardId: newColumns[0]?.boardId,
                columnIds: newColumns.map(c => c.id),
            }).catch(console.error);

            return { columns: newColumns };
        });
    },

    addMember: async (boardId, email) => {
        const { data } = await api.post(`/boards/${boardId}/members`, { email });
        const updatedBoard = normalizeBoard(data.data);
        set({ currentBoard: updatedBoard });
    },

    removeMember: async (boardId, userId) => {
        await api.delete(`/boards/${boardId}/members/${userId}`);
        set((state) => {
            if (!state.currentBoard) return state;
            return {
                currentBoard: {
                    ...state.currentBoard,
                    boardMembers: state.currentBoard.boardMembers?.filter(m => m.userId !== userId),
                    members: state.currentBoard.members.filter(id => id !== userId),
                },
            };
        });
    },
}));
