import { useState } from 'react'

// Shared email + password form for the Login and Register pages.
// onSubmit(email, password) should throw on failure; we show err.message (the API's { error }).
export default function AuthForm({ submitLabel, busyLabel, onSubmit, passwordAutoComplete }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(email.trim(), password)
    } catch (err) {
      setError(err.message)
      setSubmitting(false) // only on failure — on success the page navigates away
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <label>
        Email
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete={passwordAutoComplete}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? busyLabel : submitLabel}
      </button>
    </form>
  )
}
