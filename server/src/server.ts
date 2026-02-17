import http from 'http';
import app from './app';
import { config } from './config';
import { setupSocketIO } from './sockets';

const server = http.createServer(app);

// Setup Socket.IO
setupSocketIO(server);

server.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`📡 WebSocket ready`);
    console.log(`🏥 Health: http://localhost:${config.port}/health`);
});
