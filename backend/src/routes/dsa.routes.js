import express from 'express';
import { getProblems, createProblem, updateProblem, deleteProblem } from '../controllers/dsa.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProblemSchema, updateProblemSchema } from '../validators/dsa.validator.js';

const router = express.Router();

router.route('/')
  .get(protect, getProblems)
  .post(protect, validate(createProblemSchema), createProblem);

router.route('/:id')
  .put(protect, validate(updateProblemSchema), updateProblem)
  .delete(protect, deleteProblem);

export default router;
