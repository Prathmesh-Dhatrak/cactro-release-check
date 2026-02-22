import { Router } from 'express';
import { releaseController } from '../controllers/release.controller';
import { validate } from '../middleware/validate';
import {
  createReleaseSchema,
  updateReleaseInfoSchema,
  toggleStepSchema,
  uuidParamSchema,
} from '../validators/release.validators';

const router: Router = Router();

// static route before parameterized ones
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
