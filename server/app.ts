import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import membersRoutes from './routes/members.routes';
import trainersRoutes from './routes/trainers.routes';
import plansRoutes from './routes/plans.routes';
import attendanceRoutes from './routes/attendance.routes';
import workoutsRoutes from './routes/workouts.routes';
import paymentsRoutes from './routes/payments.routes';
import noticesRoutes from './routes/notices.routes';
import reportsRoutes from './routes/reports.routes';
import settingsRoutes from './routes/settings.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible integration in dev/testing
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Normalize /api prefix for Vercel Serverless Function rewrites
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'IRON REVOLUTION Backend Engine',
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/trainers', trainersRoutes);
app.use('/api/membership-plans', plansRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/workout', workoutsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
