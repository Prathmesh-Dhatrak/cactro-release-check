import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import { config } from './config';
import { releaseRoutes } from './routes/release.routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

export function createApp(): Application {
  const app: Application = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  if (!config.isProduction) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

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

  app.use('/api/releases', releaseRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
