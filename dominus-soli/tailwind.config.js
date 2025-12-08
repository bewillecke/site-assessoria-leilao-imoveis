/**
 * tailwind.config.js - Configuração do Tailwind CSS
 * 
 * Tailwind CSS é o framework de CSS utilitário utilizado
 * para estilização de toda a interface da aplicação.
 * 
 * Configurações:
 * - content: Arquivos que serão escaneados para classes CSS
 *   (HTML e componentes JSX)
 * - theme.extend: Customizações do tema (cores, fontes, etc.)
 *   Neste projeto, as cores principais são:
 *   - Azul: #11397a (cor primária)
 *   - Amarelo: #e6b952 (cor secundária)
 * - plugins: Plugins adicionais do Tailwind
 * 
 * As classes utilitárias do Tailwind são aplicadas diretamente
 * nos componentes React via className.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
