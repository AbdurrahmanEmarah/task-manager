import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In dev, the browser only talks to Vite (5173). Any request starting with /api
    // is forwarded to Express on 3000 — same origin for the browser, so no CORS needed.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
