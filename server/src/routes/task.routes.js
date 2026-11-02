import { Router } from 'express';
import * as ctrl from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  statusSchema,
  listQuerySchema,
  weeksQuerySchema,
  idParamSchema,
} from '../validators/task.validator.js';

const router = Router();
const withId = validate(idParamSchema, 'params');

router.get('/', validate(listQuerySchema, 'query'), ctrl.list);
router.get('/weeks', validate(weeksQuerySchema, 'query'), ctrl.weeks);
router.post('/', validate(createTaskSchema), ctrl.create);

router.get('/:id', withId, ctrl.getOne);
router.patch('/:id', withId, validate(updateTaskSchema), ctrl.update);
router.patch('/:id/status', withId, validate(statusSchema), ctrl.update);
router.delete('/:id', withId, ctrl.remove);

export default router;
