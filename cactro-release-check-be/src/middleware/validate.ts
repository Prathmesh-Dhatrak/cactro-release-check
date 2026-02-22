import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import type { ApiErrorResponse } from '../types/release.types';

/**
 * Source of the data to validate in the request.
 */
type ValidationSource = 'body' | 'params' | 'query';

/**
 * Express middleware factory for Zod schema validation.
 * Validates the specified request property against the provided schema.
 *
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate (body, params, or query)
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      /* Replace the request property with the parsed (and potentially transformed) data */
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
