/**
 * Vercel Serverless Function для Claude Code UI API
 *
 * ВАЖНО: WebSocket не поддерживается в Vercel Serverless Functions
 * Это базовая версия API только для HTTP endpoints
 */

import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from '../server/routes/auth.js';
import gitRoutes from '../server/routes/git.js';
import settingsRoutes from '../server/routes/settings.js';
import projectsRoutes from '../server/routes/projects.js';

// Import database
import { initializeDatabase } from '../server/database/db.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Claude Code UI API',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'development',
    note: 'WebSocket features are not available in Vercel Serverless deployment'
  });
});

// Initialize database before handling requests
let dbInitialized = false;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/git', gitRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Export for Vercel serverless
export default app;
