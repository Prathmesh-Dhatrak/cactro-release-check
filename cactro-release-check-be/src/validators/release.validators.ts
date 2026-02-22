import { z } from 'zod';
import { TOTAL_STEPS } from '../config/steps';

export const createReleaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Release name is required')
    .max(255, 'Release name must be 255 characters or fewer'),
  date: z
    .string()
    .datetime({ message: 'Date must be a valid ISO 8601 datetime string' }),
  additionalInfo: z
    .string()
    .max(5000, 'Additional info must be 5000 characters or fewer')
    .nullable()
    .optional()
    .default(null),
});

export const updateReleaseInfoSchema = z.object({
  additionalInfo: z
    .string()
    .max(5000, 'Additional info must be 5000 characters or fewer')
    .nullable(),
});

export const toggleStepSchema = z.object({
  stepId: z
    .number()
    .int('Step ID must be an integer')
    .min(0, 'Step ID must be non-negative')
    .max(TOTAL_STEPS - 1, `Step ID must be less than ${TOTAL_STEPS}`),
  completed: z.boolean({ required_error: 'Completed state is required' }),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid release ID format'),
});

export type CreateReleaseInput = z.infer<typeof createReleaseSchema>;
export type UpdateReleaseInfoInput = z.infer<typeof updateReleaseInfoSchema>;
export type ToggleStepInput = z.infer<typeof toggleStepSchema>;
