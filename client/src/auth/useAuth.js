import { useContext } from 'react'
import { AuthContext } from './authContext'

// Any component can call useAuth() to get the current user and login/logout
// (≈ injecting a scoped IAuthService).
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
