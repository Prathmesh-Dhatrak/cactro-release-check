import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import type { ApiErrorResponse } from '../types/release.types';

type ValidationSource = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      (req as unknown as Record<string, unknown>)[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
        return;
      }
      next(error);
    }
  };
}
