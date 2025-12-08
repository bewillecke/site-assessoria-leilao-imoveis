/**
 * postcss.config.js - Configuração do PostCSS
 * 
 * PostCSS é um processador de CSS que permite usar plugins
 * para transformar estilos. Neste projeto:
 * 
 * Plugins utilizados:
 * - @tailwindcss/postcss: Integra o Tailwind CSS ao pipeline
 *   de build, processando as classes utilitárias
 * - autoprefixer: Adiciona automaticamente prefixos de vendor
 *   (-webkit-, -moz-, etc.) para compatibilidade com navegadores
 * 
 * Este arquivo é lido automaticamente pelo Vite durante
 * o processo de build e desenvolvimento.
 */

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
