import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Proxy API calls starting with /api to the ASP.NET backend.
    // This rewrites /api/games to /games on the actual backend.
    proxy: {
      '/api': {
        target: 'http://localhost:5285',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
