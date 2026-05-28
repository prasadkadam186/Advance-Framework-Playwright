import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'allure-results/**',
      'allure-report/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'tta-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
  },
);
