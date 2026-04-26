/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/renderer/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        'dist/',
        'out/',
      ],
    },
  },
});
