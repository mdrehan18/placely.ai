import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { Server } from 'socket.io';
import setupSockets from './sockets/index.js';

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSockets(io);

// Start server
const startServer = async () => {
  await connectDB();
  
  server.listen(config.port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${config.port}`);
  });
};

startServer();
