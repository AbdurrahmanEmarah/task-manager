import { useState } from 'react'
import TaskItem from './components/TaskItem'

// Hard-coded data shaped like the API's tasks (note _id, not id).
const initialTasks = [
  { _id: 'a1', title: 'Learn JSX', done: true, priority: 'high' },
  { _id: 'b2', title: 'Write TaskItem', done: false, priority: 'medium' },
  { _id: 'c3', title: 'Drink coffee', done: false, priority: 'low' },
]

export default function App() {
  // State: like a field, but changing it via the setter re-renders the component.
  const [tasks, setTasks] = useState(initialTasks)

  function handleToggle(id) {
    // New array; the matching task is replaced by a NEW object with done flipped.
    setTasks(tasks.map((t) => (t._id === id ? { ...t, done: !t.done } : t)))
  }

  function handleDelete(id) {
    // New array without the matching task.
    setTasks(tasks.filter((t) => t._id !== id))
  }

  return (
    <>
      <h1>Task Manager</h1>
      <ul>
        {tasks.map((t) => (
          <TaskItem key={t._id} task={t} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </ul>
    </>
  )
}
