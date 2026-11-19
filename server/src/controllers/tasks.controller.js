import { Task } from '../models/task.model.js';

// Options for updates: return the updated document and enforce schema rules.
// (Updates skip schema validation unless runValidators is set.)
const UPDATE_OPTIONS = { returnDocument: 'after', runValidators: true };

// Copy only the allowed fields that the client actually sent (prevents over-posting).
const pickTaskFields = (body = {}) => {
  const fields = {};
  for (const key of ['title', 'done', 'priority']) {
    if (body[key] !== undefined) fields[key] = body[key];
  }
  return fields;
};

// No try/catch in these handlers: Express 5 forwards errors thrown in async
// handlers to the central error handler (middleware/error.middleware.js).
// That handler turns ValidationError -> 400, invalid ObjectId (CastError) -> 400, anything else -> 500.

// GET /api/tasks
export const getAllTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

// POST /api/tasks  — done always starts false, so only title/priority are accepted
export const createTask = async (req, res) => {
  const { title, priority } = req.body ?? {};
  const task = await Task.create({ title, priority });
  res.status(201).location(`/api/tasks/${task._id}`).json(task);
};

// PUT /api/tasks/:id  — full replace: every field is required
export const replaceTask = async (req, res) => {
  const fields = pickTaskFields(req.body ?? {});
  const missing = ['title', 'done', 'priority'].filter(key => fields[key] === undefined);
  if (missing.length > 0) {
    return res.status(400).json({ error: `PUT requires all fields; missing: ${missing.join(', ')}` });
  }

  const task = await Task.findByIdAndUpdate(req.params.id, fields, UPDATE_OPTIONS);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

// PATCH /api/tasks/:id  — partial update: only the fields sent are changed
export const updateTask = async (req, res) => {
  const fields = pickTaskFields(req.body ?? {});
  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: 'Send at least one of: title, done, priority' });
  }

  const task = await Task.findByIdAndUpdate(req.params.id, fields, UPDATE_OPTIONS);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).end();
};
