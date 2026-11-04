import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'motion/react': 'framer-motion',
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
})

