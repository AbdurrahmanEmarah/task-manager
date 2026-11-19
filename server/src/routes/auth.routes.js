import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Mounted at /api/auth in index.js
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me); // requireAuth only on this route

export default router;
