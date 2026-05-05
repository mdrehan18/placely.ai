import express from 'express';
import { analyzeResume } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/analyze', protect, upload.single('resume'), analyzeResume);

export default router;
