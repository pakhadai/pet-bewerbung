import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vsharp from 'vite-plugin-vsharp'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { VitePWA } from 'vite-plugin-pwa'

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
      exclude: ['og-image.jpg'],
      png: { quality: 85 },
      jpeg: { quality: 85 },
      width: 256,
      height: 256,
    }),
    /** Embed CSS in JS — removes render-blocking <link rel="stylesheet"> (Lighthouse). */
    cssInjectedByJsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml', 'logo-header.webp'],
      manifest: {
        name: 'Pet-Bewerbung',
        short_name: 'Pet-CV',
        description: 'Professionelles Haustier-CV für die Wohnungsbewerbung (Schweiz)',
        theme_color: '#b39ddb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        /** Locale paths: /de/, /fr/, … — `/` redirects in app (RootRedirect). */
        icons: [
          { src: '/android-chrome-192x192.webp', sizes: '192x192', type: 'image/webp' },
          { src: '/android-chrome-512x512.webp', sizes: '512x512', type: 'image/webp' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,ttf,json,webmanifest}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
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
