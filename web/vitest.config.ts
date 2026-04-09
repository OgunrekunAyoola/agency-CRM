import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000',
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
