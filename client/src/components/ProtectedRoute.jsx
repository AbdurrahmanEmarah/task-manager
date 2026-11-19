import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

// ≈ [Authorize] for a page: logged out → redirect to /login,
// remembering where the user wanted to go so login can send them back.
export default function ProtectedRoute({ children }) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <p className="muted">Checking your session…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
