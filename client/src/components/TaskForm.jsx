import { useState } from 'react'

// Controlled form: React state is the single source of truth for each input's value.
// Props: onAdd(title, priority) — App decides what "adding" means (in memory today, API on Day 5).
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(e) {
    e.preventDefault() // stop the browser's default full-page form POST/reload

    const trimmed = title.trim()
    if (!trimmed) return // same rule as the API: title is required

    onAdd(trimmed, priority)
    setTitle('') // clear the input; priority keeps its last choice
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs doing?"
        value={title}                                   // value comes FROM state...
        onChange={(e) => setTitle(e.target.value)}      // ...and every keystroke goes back INTO state
        maxLength={200}                                 // mirrors the API's 200-char limit
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" className="primary" disabled={!title.trim()}>
        Add
      </button>
    </form>
  )
}
