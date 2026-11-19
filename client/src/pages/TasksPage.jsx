import { useEffect, useState } from 'react'
import * as api from '../api/tasks'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

// Sort helper: newest first, same order as GET /api/tasks.
const newestFirst = (a, b) => b.createdAt.localeCompare(a.createdAt)

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // message string shown in the red banner

  // ---- Load on mount --------------------------------------------------------
  // useEffect(fn, []) ≈ "run once after the component first appears" (like OnInitializedAsync).
  // The function it returns is the cleanup (≈ Dispose): it runs when the component goes away.
  // In dev, <StrictMode> mounts → unmounts → mounts again on purpose; aborting the first
  // request in the cleanup makes that harmless.
  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const data = await api.getTasks(controller.signal)
        setTasks(data)
        setError(null)
      } catch (err) {
        if (err.name === 'AbortError') return // we cancelled it ourselves — not an error
        setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  // If the server says the task no longer exists (404), drop it from the list.
  function handleMissing(id, err) {
    setTasks((prev) => prev.filter((t) => t._id !== id))
    setError(`${err.message} — it was probably deleted elsewhere, so it has been removed from the list.`)
  }

  // ---- Add: PESSIMISTIC (wait for the server) -------------------------------
  // We need the server's response anyway: MongoDB creates _id and createdAt.
  // Returns true/false so TaskForm knows whether to clear the input.
  async function handleAdd(title, priority) {
    try {
      const created = await api.createTask(title, priority)
      setTasks((prev) => [created, ...prev])
      setError(null)
      return true
    } catch (err) {
      setError(err.message) // e.g. 400 "Path `title` is required." straight from the API
      return false
    }
  }

  // ---- Toggle: OPTIMISTIC (update the UI first, roll back on failure) -------
  async function handleToggle(id) {
    const task = tasks.find((t) => t._id === id)
    if (!task) return
    const newDone = !task.done

    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, done: newDone } : t))) // instant feedback

    try {
      const updated = await api.updateTask(id, { done: newDone }) // PATCH { done }
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t))) // use the server's version
    } catch (err) {
      if (err.status === 404) return handleMissing(id, err)
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, done: task.done } : t))) // roll back
      setError(`Could not update "${task.title}": ${err.message}`)
    }
  }

  // ---- Delete: OPTIMISTIC as well -------------------------------------------
  async function handleDelete(id) {
    const task = tasks.find((t) => t._id === id)
    if (!task) return

    setTasks((prev) => prev.filter((t) => t._id !== id))

    try {
      await api.deleteTask(id) // 204, no body
    } catch (err) {
      if (err.status === 404) return // already gone on the server — the UI is already correct
      setTasks((prev) => [...prev, task].sort(newestFirst)) // put it back where it was
      setError(`Could not delete "${task.title}": ${err.message}`)
    }
  }

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <>
      <h1>Task Manager</h1>

      {error && (
        <div className="error" role="alert">
          {error}{' '}
          <button onClick={() => setError(null)} aria-label="Dismiss error">
            ✕
          </button>
        </div>
      )}

      <TaskForm onAdd={handleAdd} />

      {loading ? (
        <p className="muted">Loading tasks…</p>
      ) : (
        <>
          <p className="muted">
            {remaining} of {tasks.length} remaining
          </p>
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        </>
      )}
    </>
  )
}
