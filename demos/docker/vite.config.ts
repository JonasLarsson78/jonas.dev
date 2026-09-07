import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/demos/docker/',
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
