/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@asteroid-miner/(.*)$',
    '',
    '^[./]',
  ],
  tailwindFunctions: ['clsx', 'cn', 'cva'],
};
