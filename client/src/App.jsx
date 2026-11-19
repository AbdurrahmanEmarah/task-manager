import TaskItem from './components/TaskItem'

// Hard-coded data shaped like the API's tasks (note _id, not id).
const initialTasks = [
  { _id: 'a1', title: 'Learn JSX', done: true, priority: 'high' },
  { _id: 'b2', title: 'Write TaskItem', done: false, priority: 'medium' },
  { _id: 'c3', title: 'Drink coffee', done: false, priority: 'low' },
]

export default function App() {
  return (
    <>
      <h1>Task Manager</h1>
      <ul>
        {initialTasks.map((t) => (
          <TaskItem key={t._id} task={t} />
        ))}
      </ul>
    </>
  )
}
