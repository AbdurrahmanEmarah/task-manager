import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import { AuthContext } from './authContext'
import { clearToken, getToken, setToken } from './tokenStorage'

// React Context ≈ a scoped service: one instance holds "who is logged in",
// and every component under <AuthProvider> can read it via useAuth().
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // 'loading' while we check a saved token with GET /api/auth/me on startup,
  // so protected pages don't flash the login screen on every reload.
  const [status, setStatus] = useState(() => (getToken() ? 'loading' : 'ready'))
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('ready')
  }, [])

  // On startup: if a token was saved, ask the server who it belongs to.
  useEffect(() => {
    if (!getToken()) return
    const controller = new AbortController()
    authApi
      .getMe(controller.signal)
      .then((me) => {
        setUser(me)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        // 401 → client.js already called the unauthorized handler (logout).
        // Other errors (server down): keep it simple and log out too.
        logout()
      })
    return () => controller.abort()
  }, [logout])

  // Any API call that gets 401 with our token → token expired/invalid → log out + go to /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout()
      navigate('/login', { replace: true })
    })
    return () => setUnauthorizedHandler(() => {})
  }, [logout, navigate])

  const handleAuthResponse = useCallback(({ token, user }) => {
    setToken(token)
    setUser(user)
    setStatus('ready')
  }, [])

  const login = useCallback(
    async (email, password) => handleAuthResponse(await authApi.login(email, password)),
    [handleAuthResponse]
  )
  const register = useCallback(
    async (email, password) => handleAuthResponse(await authApi.register(email, password)),
    [handleAuthResponse]
  )

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
