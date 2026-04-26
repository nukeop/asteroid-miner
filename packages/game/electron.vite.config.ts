import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['@asteroid-miner/model'],
      },
    },
  },
  preload: {
    build: {
      externalizeDeps: {
        exclude: ['@asteroid-miner/model'],
      },
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
  },
  renderer: {
    plugins: [
      react(),
      tanstackRouter({
        routesDirectory: './routes',
        generatedRouteTree: './routeTree.gen.ts',
      }),
      tailwindcss(),
    ],
    build: {
      target: 'es2022',
    },
  },
});
