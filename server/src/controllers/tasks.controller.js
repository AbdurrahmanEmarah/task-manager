// In-memory data for Day 2. On Day 3 this is replaced by a Mongoose model.
const VALID_PRIORITIES = ['low', 'medium', 'high'];

let nextId = 4;
const tasks = [
  { id: 1, title: 'Learn Express', done: false, priority: 'high' },
  { id: 2, title: 'Set up GitHub repo', done: true, priority: 'medium' },
  { id: 3, title: 'Buy coffee', done: false, priority: 'low' },
];

// GET /api/tasks
export const getAllTasks = (req, res) => {
  res.json(tasks);
};

// GET /api/tasks/:id
export const getTaskById = (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
};

// POST /api/tasks
export const createTask = (req, res) => {
  const { title, priority = 'medium' } = req.body ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'priority must be low, medium or high' });
  }

  const task = { id: nextId++, title: title.trim(), done: false, priority };
  tasks.push(task);

  res.status(201).location(`/api/tasks/${task.id}`).json(task);
};

// PUT /api/tasks/:id  — full replace: every field is required
export const replaceTask = (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, done, priority } = req.body ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  if (typeof done !== 'boolean') {
    return res.status(400).json({ error: 'done is required and must be true or false' });
  }
  if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'priority is required and must be low, medium or high' });
  }

  tasks[index] = { id: tasks[index].id, title: title.trim(), done, priority };
  res.json(tasks[index]);
};

// PATCH /api/tasks/:id  — partial update: only the fields sent are changed
export const updateTask = (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, done, priority } = req.body ?? {};

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'done must be true or false' });
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'priority must be low, medium or high' });
  }

  if (title !== undefined) task.title = title.trim();
  if (done !== undefined) task.done = done;
  if (priority !== undefined) task.priority = priority;

  res.json(task);
};

// DELETE /api/tasks/:id
export const deleteTask = (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).end();
};
