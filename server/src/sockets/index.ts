import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';

let io: Server;

export const setupSocketIO = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: config.cors.origin,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // JWT authentication middleware for sockets
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
            (socket as any).userId = decoded.userId;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${(socket as any).userId}`);

        // Join board room
        socket.on('join:board', (boardId: string) => {
            socket.join(`board:${boardId}`);
            console.log(`👤 User ${(socket as any).userId} joined board:${boardId}`);
        });

        // Leave board room
        socket.on('leave:board', (boardId: string) => {
            socket.leave(`board:${boardId}`);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected: ${(socket as any).userId}`);
        });
    });
};

// Helper to emit events to a board room
export const emitToBoard = (boardId: string, event: string, payload: any) => {
    if (io) {
        io.to(`board:${boardId}`).emit(event, payload);
    }
};
