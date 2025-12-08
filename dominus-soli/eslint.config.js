/**
 * eslint.config.js - Configuração do ESLint (Linter de JavaScript)
 * 
 * ESLint analisa o código JavaScript/JSX em busca de erros,
 * problemas de estilo e más práticas de programação.
 * 
 * Configurações utilizadas:
 * - @eslint/js: Regras recomendadas para JavaScript moderno
 * - eslint-plugin-react-hooks: Valida uso correto dos hooks do React
 *   (ex: dependências do useEffect, regras de hooks)
 * - eslint-plugin-react-refresh: Compatibilidade com Fast Refresh do Vite
 * 
 * Regras customizadas:
 * - no-unused-vars: Ignora variáveis não utilizadas que começam
 *   com letra maiúscula (componentes React exportados)
 * 
 * Arquivos ignorados:
 * - dist/: Pasta de build de produção
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignora a pasta de build de produção
  globalIgnores(['dist']),
  {
    // Aplica regras a todos os arquivos JS e JSX
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,               // Regras recomendadas do ESLint
      reactHooks.configs['recommended-latest'], // Regras para React Hooks
      reactRefresh.configs.vite,            // Compatibilidade com Vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,             // Variáveis globais do navegador
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },        // Habilita parsing de JSX
        sourceType: 'module',               // Usa ES Modules
      },
    },
    rules: {
      // Permite variáveis não utilizadas se começam com maiúscula (componentes)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
