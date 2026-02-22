import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import { config } from './config';
import { releaseRoutes } from './routes/release.routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

/**
 * Creates and configures the Express application.
 * Separating app creation from server startup enables easier testing.
 *
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app: Application = express();

  /* ─── Security Middleware ─── */
  app.use(helmet());

  /* ─── CORS Configuration ─── */
  app.use(
    cors({
      origin: config.corsOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  /* ─── Request Parsing ─── */
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  /* ─── Logging ─── */
  if (!config.isProduction) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  /* ─── Health Check ─── */
  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      },
    });
  });

  /* ─── API Routes ─── */
  app.use('/api/releases', releaseRoutes);

  /* ─── Error Handling ─── */
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
