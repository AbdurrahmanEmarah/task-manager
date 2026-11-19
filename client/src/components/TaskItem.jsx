// One row in the list.
// Props: task (data), onToggle / onDelete (callbacks owned by App — "events flow up").
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task._id)}
      />
      <span className={task.done ? 'title done' : 'title'}>{task.title}</span>
      <span className={`priority ${task.priority}`}>{task.priority}</span>
      {/* Arrow fn = "call later on click". onClick={onDelete(task._id)} would call it during render! */}
      <button className="danger" onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </li>
  )
}
