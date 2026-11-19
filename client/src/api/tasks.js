// Task endpoints. All of them require login — client.js adds the Bearer token.
import { request } from './client'

export { ApiError } from './client'

export const getTasks = (signal) => request('/tasks', { signal })
export const createTask = (title, priority) => request('/tasks', { method: 'POST', body: { title, priority } })
export const updateTask = (id, changes) => request(`/tasks/${id}`, { method: 'PATCH', body: changes })
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' })
