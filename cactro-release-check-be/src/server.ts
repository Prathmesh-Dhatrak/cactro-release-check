import { createApp } from './app';
import { config } from './config';
import { prisma } from './config/database';

async function main(): Promise<void> {
  const app = createApp();

  try {
    await prisma.$connect();
    console.log('[DB] Connected to PostgreSQL successfully');
  } catch (error) {
    console.error('[DB] Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`[SERVER] Running on port ${config.port} in ${config.nodeEnv} mode`);
    console.log(`[SERVER] API available at http://localhost:${config.port}/api`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[SERVER] Received ${signal}. Shutting down gracefully...`);
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error: unknown) => {
  console.error('[SERVER] Unhandled error during startup:', error);
  process.exit(1);
});
