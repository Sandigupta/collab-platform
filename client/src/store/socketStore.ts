import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';


const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://collab-platform-o3jr.onrender.com';

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    joinBoard: (boardId: string) => void;
    leaveBoard: (boardId: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,

    connect: () => {
        const { socket } = get();
        if (socket?.connected) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            console.log('🔌 Socket connected:', newSocket.id);
            set({ isConnected: true });
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            set({ isConnected: false });
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        set({ socket: newSocket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },

    joinBoard: (boardId: string) => {
        const { socket } = get();
        if (socket) {
            socket.emit('join:board', boardId);
        }
    },

    leaveBoard: (boardId: string) => {
        const { socket } = get();
        if (socket) {
            socket.emit('leave:board', boardId);
        }
    }
}));
