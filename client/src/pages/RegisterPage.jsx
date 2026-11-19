import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../auth/useAuth'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  if (user) return <Navigate to="/" replace />

  async function handleRegister(email, password) {
    await register(email, password) // throws ApiError (400 short password, 409 email taken)
    navigate('/', { replace: true })
  }

  return (
    <>
      <h1>Register</h1>
      <AuthForm
        submitLabel="Create account"
        busyLabel="Creating account…"
        passwordAutoComplete="new-password"
        onSubmit={handleRegister}
      />
      <p className="muted">Password: at least 8 characters.</p>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  )
}
