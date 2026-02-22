import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration object.
 * Centralizes all environment variables with type-safe defaults.
 */
export const config = {
  /** Server port number */
  port: parseInt(process.env.PORT || '3001', 10),

  /** Current environment (development | production | test) */
  nodeEnv: process.env.NODE_ENV || 'development',

  /**
   * Allowed CORS origins for frontend.
   * Supports comma-separated values for multiple origins (e.g., local + production).
   */
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),

  /** Whether the app is running in production */
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/** Type representing the application configuration */
export type AppConfig = typeof config;
