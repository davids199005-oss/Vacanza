// Назначение файла: единая конфигурация ESLint для TypeScript/React frontend-кода.

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Игнорируем артефакты сборки.
  globalIgnores(['dist']),
  {
    // Применяем правила только к TS/TSX исходникам.
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // Целевой синтаксис и браузерные глобалы.
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
