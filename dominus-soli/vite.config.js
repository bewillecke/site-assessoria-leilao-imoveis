/**
 * vite.config.js - Configuração do Vite (Build Tool)
 * 
 * Vite é a ferramenta de build utilizada neste projeto.
 * Responsável por:
 * - Servidor de desenvolvimento com Hot Module Replacement (HMR)
 * - Build de produção otimizado
 * - Suporte a módulos ES nativos
 * 
 * O plugin @vitejs/plugin-react habilita:
 * - Fast Refresh para React (atualização instantânea)
 * - Transformação de JSX
 * - Suporte a React 19
 * 
 * Scripts disponíveis (package.json):
 * - npm run dev: Inicia servidor de desenvolvimento
 * - npm run build: Gera build de produção
 * - npm run preview: Visualiza build de produção localmente
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Documentação oficial: https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
