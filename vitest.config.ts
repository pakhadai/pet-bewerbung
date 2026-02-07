/**
 * Vitest Configuration
 * Modern, fast unit testing for Vite projects
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/utils/__tests__/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/utils/__tests__/',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.config.{ts,js}',
        'dist/',
      ],
    },
  },
});
