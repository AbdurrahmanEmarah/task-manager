import { createContext } from 'react'

// The "shape" shared app-wide: { user, status, login, register, logout }.
// Kept in its own file so AuthProvider.jsx only exports a component (fast refresh rule).
export const AuthContext = createContext(null)
