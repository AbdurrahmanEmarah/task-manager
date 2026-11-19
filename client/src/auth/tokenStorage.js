// Where the JWT lives between page reloads.
// localStorage is simple, but any JavaScript on the page can read it (XSS risk).
// The more secure alternative is an httpOnly cookie set by the server — JS can't read it at all.
const KEY = 'taskmanager.token'

const safe = (fn, fallback = null) => {
  try {
    return fn()
  } catch {
    return fallback // storage can be blocked (e.g. some private-browsing modes)
  }
}

export const getToken = () => safe(() => localStorage.getItem(KEY))
export const setToken = (token) => safe(() => localStorage.setItem(KEY, token))
export const clearToken = () => safe(() => localStorage.removeItem(KEY))
