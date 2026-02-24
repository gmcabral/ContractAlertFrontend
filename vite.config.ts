import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← Tailwind v4: plugin de Vite, sin postcss.config
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      // En dev: /api → Azure Functions local (puerto 7071 docker, puerto 7230 host)
      '/api': {
        target: 'http://localhost:7230',
        changeOrigin: true,
      }
    }
  }
})