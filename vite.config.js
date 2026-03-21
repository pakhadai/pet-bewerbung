import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vsharp from 'vite-plugin-vsharp'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    /** Embed CSS in JS — removes render-blocking <link rel="stylesheet"> (Lighthouse). */
    cssInjectedByJsPlugin(),
  ],
  define: {
    'global': 'globalThis',
  },
  build: {
    /** Smaller prod bundles; keep console in dev */
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-pdf/renderer')) return 'react-pdf';
          /** JSZip: no forced chunk name — avoids Rollup hoisting a static import into the entry. */
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
  },
}))
