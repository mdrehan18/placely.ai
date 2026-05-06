import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { Server } from 'socket.io';
import setupSockets from './sockets/index.js';

const server = http.createServer(app);

const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://placely-omega.vercel.app'
];

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(allowed => {
        if (!allowed) return false;
        if (origin === allowed) return true;
        if (origin === `https://${allowed}` || origin === `http://${allowed}`) return true;
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

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
