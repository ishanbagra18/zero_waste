import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/zero_waste/' : '/'),
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

