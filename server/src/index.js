import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  res.send('Hello from Abdurrahman the Task Manager API');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});