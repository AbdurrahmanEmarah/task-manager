import TaskItem from './TaskItem'

// Renders the list. Owns no state — just passes data down and callbacks through.
export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="muted">No tasks yet — add one above.</p>
  }

  return (
    <ul>
      {tasks.map((t) => (
        <TaskItem key={t._id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
