import express from 'express';
import tasksRouter from './routes/tasks.routes.js';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Abdurrahman the Task Manager API');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/tasks', tasksRouter);

// These two must come AFTER all routes.
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB first; only start accepting requests once that works.
try {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}
