import { useState } from 'react'

// Controlled form: React state is the single source of truth for each input's value.
// Props: onAdd(title, priority) → Promise<boolean>. The parent does the API call and
// tells us whether it worked, so we only clear the input on success.
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault() // stop the browser's default full-page form POST/reload

    const trimmed = title.trim()
    if (!trimmed) return // same rule as the API: title is required

    setSubmitting(true)
    const ok = await onAdd(trimmed, priority)
    setSubmitting(false)
    if (ok) setTitle('') // on failure keep the text so the user can fix it and retry
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
      <button type="submit" className="primary" disabled={submitting || !title.trim()}>
        {submitting ? 'Adding…' : 'Add'}
      </button>
    </form>
  )
}
