import { Link } from 'react-router-dom'

// Placeholder — Day 6 (auth) turns this into a real form that calls POST /api/auth/register.
export default function RegisterPage() {
  return (
    <>
      <h1>Register</h1>
      <p className="muted">Coming on Day 6.</p>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  )
}
