// All HTTP calls to the backend live here, so components never touch fetch() directly.
// Paths start with /api — in dev, Vite's proxy (vite.config.js) forwards them to Express on :3000.
// Day 6: this is the one place to add the "Authorization: Bearer <token>" header.

// An Error that also carries the HTTP status, so the UI can react to 404 vs 400 etc.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      signal,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
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
    const fallback =
      res.status >= 500 ? 'The server is not responding. Is the API running?' : `Request failed (${res.status})`
    throw new ApiError(data?.error ?? fallback, res.status) // show the API's own { error } message
  }
  return data
}

export const getTasks = (signal) => request('/tasks', { signal })
export const createTask = (title, priority) => request('/tasks', { method: 'POST', body: { title, priority } })
export const updateTask = (id, changes) => request(`/tasks/${id}`, { method: 'PATCH', body: changes })
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' })
