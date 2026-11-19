import { useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

// Hard-coded data shaped like the API's tasks (note _id, not id). Replaced by a fetch on Day 5.
const initialTasks = [
  { _id: 'a1', title: 'Learn JSX', done: true, priority: 'high' },
  { _id: 'b2', title: 'Write TaskItem', done: false, priority: 'medium' },
  { _id: 'c3', title: 'Drink coffee', done: false, priority: 'low' },
]

export default function App() {
  // App owns the state; children get data via props and report events via callbacks.
  const [tasks, setTasks] = useState(initialTasks)

  // Updater form setTasks(prev => ...): React hands you the latest state,
  // which stays correct even if several updates happen before the next render.
  function handleAdd(title, priority) {
    const newTask = {
      _id: crypto.randomUUID(), // temporary local id; on Day 5 MongoDB generates _id
      title,
      done: false,
      priority,
    }
    setTasks((prev) => [newTask, ...prev]) // newest first, like GET /api/tasks
  }

  function handleToggle(id) {
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, done: !t.done } : t)))
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t._id !== id))
  }

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <>
      <h1>Task Manager</h1>
      <TaskForm onAdd={handleAdd} />
      <p className="muted">
        {remaining} of {tasks.length} remaining
      </p>
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
    </>
  )
}
