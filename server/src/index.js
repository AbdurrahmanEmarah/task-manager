import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

const VALID_PRIORITIES = ['low', 'medium', 'high'];

let nextId = 4;
const tasks = [
  { id: 1, title: 'Learn Express', done: false, priority: 'high' },
  { id: 2, title: 'Set up GitHub repo', done: true, priority: 'medium' },
  { id: 3, title: 'Buy coffee', done: false, priority: 'low' },
];

app.get('/', (req, res) => {
  res.send('Hello from Abdurrahman the Task Manager API');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});


app.post('/api/tasks', (req, res) => {
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
});

app.patch('/api/tasks/:id', (req, res) => {
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
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).end();
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});