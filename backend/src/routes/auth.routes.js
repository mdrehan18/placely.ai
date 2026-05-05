import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
