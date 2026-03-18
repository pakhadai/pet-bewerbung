import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vsharp from 'vite-plugin-vsharp'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vsharp({
      include: /\.(png|jpg|jpeg|webp)$/,
      exclude: ['og-image.jpg.jpg'],
      png: { quality: 85 },
      jpeg: { quality: 85 },
      width: 256,
      height: 256,
    }),
  ],
  define: {
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-pdf': ['@react-pdf/renderer'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:4242',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
