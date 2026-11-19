// One row in the list. Receives a single task via props (like a readonly ctor param).
export default function TaskItem({ task }) {
  return (
    <li>
      <span className={task.done ? 'title done' : 'title'}>{task.title}</span>
      <span className={`priority ${task.priority}`}>{task.priority}</span>
    </li>
  )
}
