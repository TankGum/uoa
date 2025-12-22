import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        // When running in Docker, proxy to backend container
        // When running locally, proxy to localhost:8000
        target: process.env.VITE_API_URL || (process.env.DOCKER ? 'http://backend:8000' : 'http://localhost:8000'),
        changeOrigin: true,
      }
    }
  }
})

