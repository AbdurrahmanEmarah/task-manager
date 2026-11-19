import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller.js';

const router = Router();

// Mounted at /api/tasks in index.js, so '/' here means /api/tasks
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', replaceTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
