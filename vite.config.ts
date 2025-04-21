import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.1.104/ens-mobile-app-backend/public',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/sample': {
        target: 'http://192.168.1.104/ens-mobile-app-backend/public',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})