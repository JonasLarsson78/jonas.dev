import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/demos/react/',
  server: { proxy: { '/api': 'http://localhost:3003' } },
})
