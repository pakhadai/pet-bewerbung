import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vsharp from 'vite-plugin-vsharp'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer'],
      globals: { Buffer: true },
    }),
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-pdf/renderer')) return 'react-pdf';
          if (id.includes('node_modules/jszip')) return 'jszip';
          if (id.includes('node_modules/qrcode')) return 'qrcode';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    host: true,
    port: 3000
  }
})
