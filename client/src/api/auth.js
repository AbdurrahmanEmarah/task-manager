// Auth endpoints. register/login return { token, user }; me returns the user.
import { request } from './client'

export const register = (email, password) =>
  request('/auth/register', { method: 'POST', body: { email, password } })
export const login = (email, password) => request('/auth/login', { method: 'POST', body: { email, password } })
export const getMe = (signal) => request('/auth/me', { signal })
