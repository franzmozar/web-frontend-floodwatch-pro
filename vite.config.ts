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
        target: 'https://ens-mobile-app-backend-419947829015.us-central1.run.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/sample': {
        target: 'https://ens-mobile-app-backend-419947829015.us-central1.run.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/web': {
        target: 'https://ens-mobile-app-backend-419947829015.us-central1.run.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})