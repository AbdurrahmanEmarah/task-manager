import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../auth/useAuth'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/' // set by ProtectedRoute

  if (user) return <Navigate to={from} replace /> // already logged in

  async function handleLogin(email, password) {
    await login(email, password) // throws ApiError (e.g. 401 "Invalid email or password")
    navigate(from, { replace: true })
  }

  return (
    <>
      <h1>Log in</h1>
      <AuthForm
        submitLabel="Log in"
        busyLabel="Logging in…"
        passwordAutoComplete="current-password"
        onSubmit={handleLogin}
      />
      <p>
        No account yet? <Link to="/register">Register</Link>
      </p>
    </>
  )
}
