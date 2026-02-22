import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config';
import type { ApiErrorResponse } from '../types/release.types';

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Not Found error (404).
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID '${id}' not found`, StatusCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a consistent JSON error response.
 * In development, includes the error stack trace for debugging.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: err.message || 'Internal Server Error',
    ...(config.isProduction ? {} : { details: err.stack }),
  };

  console.error(`[ERROR] ${err.name}: ${err.message}`, config.isProduction ? '' : err.stack);

  res.status(statusCode).json(errorResponse);
}

/**
 * Middleware for handling 404 routes that don't match any defined endpoint.
 */
export function notFoundHandler(_req: Request, res: Response): void {
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: 'The requested resource was not found',
  };
  res.status(StatusCodes.NOT_FOUND).json(errorResponse);
}
