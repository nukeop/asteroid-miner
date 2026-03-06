import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
    build: {
      target: 'es2022',
    },
  },
});
