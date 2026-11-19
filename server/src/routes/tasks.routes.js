import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Every task route requires a logged-in user (≈ [Authorize] on the whole controller).
router.use(requireAuth);

// Mounted at /api/tasks in index.js, so '/' here means /api/tasks
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', replaceTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
