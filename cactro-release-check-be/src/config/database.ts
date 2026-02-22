import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client instance.
 * Ensures a single database connection pool is reused across the application.
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export { prisma };
