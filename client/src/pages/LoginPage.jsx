import { Link } from 'react-router-dom'

// Placeholder — Day 6 (auth) turns this into a real form that calls POST /api/auth/login.
export default function LoginPage() {
  return (
    <>
      <h1>Log in</h1>
      <p className="muted">Coming on Day 6.</p>
      <p>
        No account yet? <Link to="/register">Register</Link>
      </p>
    </>
  )
}
