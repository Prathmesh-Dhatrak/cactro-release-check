import { Router } from 'express';
import { releaseController } from '../controllers/release.controller';
import { validate } from '../middleware/validate';
import {
  createReleaseSchema,
  updateReleaseInfoSchema,
  toggleStepSchema,
  uuidParamSchema,
} from '../validators/release.validators';

/**
 * Release API routes.
 *
 * Endpoints:
 * - GET    /api/releases        → List all releases
 * - GET    /api/releases/steps  → Get available checklist steps
 * - GET    /api/releases/:id    → Get a single release
 * - POST   /api/releases        → Create a new release
 * - PATCH  /api/releases/:id/info  → Update release additional info
 * - PATCH  /api/releases/:id/steps → Toggle a step's completion
 * - DELETE /api/releases/:id    → Delete a release
 */
const router: Router = Router();

/* Static route must come before parameterized routes to avoid conflicts */
router.get('/steps', releaseController.getSteps);

router.get('/', releaseController.getAll);

router.get(
  '/:id',
  validate(uuidParamSchema, 'params'),
  releaseController.getById,
);

router.post(
  '/',
  validate(createReleaseSchema, 'body'),
  releaseController.create,
);

router.patch(
  '/:id/info',
  validate(uuidParamSchema, 'params'),
  validate(updateReleaseInfoSchema, 'body'),
  releaseController.updateInfo,
);

router.patch(
  '/:id/steps',
  validate(uuidParamSchema, 'params'),
  validate(toggleStepSchema, 'body'),
  releaseController.toggleStep,
);

router.delete(
  '/:id',
  validate(uuidParamSchema, 'params'),
  releaseController.delete,
);

export { router as releaseRoutes };
