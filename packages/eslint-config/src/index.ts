import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/target/**',
      '**/node_modules/**',
      '**/pkg/**',
      '**/*.d.ts',
      '**/*.gen.*',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...reactPlugin.configs.flat['jsx-runtime'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      curly: ['error', 'all'],
    },
  },
]);
