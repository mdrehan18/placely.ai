import express from 'express';
import { createRoadmap, getRoadmaps, updateTaskStatus } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createRoadmapSchema } from '../validators/ai.validator.js';

const router = express.Router();

router.route('/roadmap')
  .get(protect, getRoadmaps);

router.post('/roadmap/generate', protect, validate(createRoadmapSchema), createRoadmap);

router.patch('/roadmap/:roadmapId/task/:taskId', protect, updateTaskStatus);

export default router;
