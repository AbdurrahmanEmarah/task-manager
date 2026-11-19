// The one place that talks HTTP to our API (≈ a typed HttpClient wrapper).
// - Adds "Authorization: Bearer <token>" when we have a token.
// - Turns error responses into ApiError(message, status) using the API's { error } body.
// - On 401 for a request that SENT a token (= token expired/invalid), calls the
//   handler registered by AuthProvider, which logs out and redirects to /login.
import { getToken } from '../auth/tokenStorage'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  const token = getToken()
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      signal,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err // request was cancelled on purpose; let caller ignore it
    throw new ApiError('Cannot reach the server. Check your connection.', 0)
  }

  if (res.status === 204) return null // DELETE: success, no body

  // Our API always answers with JSON. If parsing fails (e.g. the Vite proxy's empty
  // response when Express is down), data is null and we fall back to a generic message.
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // Only treat 401 as "session over" if we actually sent a token.
    // (A 401 from POST /auth/login just means wrong password — show it on the form.)
    if (res.status === 401 && token) onUnauthorized()

    const fallback =
      res.status >= 500 ? 'The server is not responding. Is the API running?' : `Request failed (${res.status})`
    throw new ApiError(data?.error ?? fallback, res.status) // show the API's own { error } message
  }
  return data
}
