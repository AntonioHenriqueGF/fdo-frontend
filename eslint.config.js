import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
    },
    extends: [
      // js.configs.recommended,

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.eslintRecommended,

      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "react-hooks/exhaustive-deps": 'warn',
        '@stylistic/indent': ['error', 2],
        '@stylistic/quotes': ['error', 'single'],
        '@stylistic/semi': ['error', 'always'],
        '@stylistic/comma-dangle': ['error', 'always-multiline'],
        '@stylistic/space-before-function-paren': ['error', 'never'],
        '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
    },
  },
])
