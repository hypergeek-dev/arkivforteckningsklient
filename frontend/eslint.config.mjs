import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/*.html', 'reports/*', '**/node_modules', '**/dist'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended'
  ),
  {
    plugins: {
      react,
      '@typescript-eslint': typescriptEslint,
      prettier,
    },
    rules: {
      // Add your custom rules here
    },
  },
];
