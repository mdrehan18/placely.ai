import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import dsaRoutes from './routes/dsa.routes.js';
import aiRoutes from './routes/ai.routes.js';
import resumeRoutes from './routes/resume.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
