import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { tailwind4 } from 'tailwind-csstree';
import tseslint from 'typescript-eslint';

const ignores = [
  '**/dist/**/*',
  '**/build/**/*',
  '**/out/**/*',
  '**/target/**/*',
  '**/node_modules/**/*',
  '**/pkg/**/*',
  '**/*.d.ts',
  '**/*.d.ts.map',
  '**/*.js.map',
  '**/*.gen.*',
  'packages/*/coverage',
];

export default defineConfig([
  globalIgnores(ignores),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  tseslint.configs.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  // @ts-expect-error storybook plugin types lag behind eslint 10
  storybook.configs['flat/recommended'],
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.md'],
    // @ts-expect-error markdown plugin types lag behind eslint 10
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: [markdown.configs.recommended],
  },
  {
    files: ['**/*.css'],
    // @ts-expect-error css plugin types lag behind eslint 10
    plugins: { css },
    language: 'css/css',
    languageOptions: {
      tolerant: true,
      customSyntax: {
        ...tailwind4,
      },
    },
    extends: [css.configs.recommended],
    rules: {
      'css/no-invalid-at-rules': 0,
      'css/no-invalid-properties': 0,
    },
  },
  { ...prettierPlugin, ignores: ['**/*.md'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      curly: ['error', 'all'],
    },
  },
]);
