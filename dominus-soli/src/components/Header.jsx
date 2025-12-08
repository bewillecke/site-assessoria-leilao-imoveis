/**
 * Header.jsx - Componente de Cabeçalho do Site
 * 
 * Exibe o cabeçalho principal da aplicação com:
 * - Logo da Dominus Soli
 * - Título "Assessoria em Leilão de Imóveis"
 * - Slogan da empresa
 * 
 * Este componente é utilizado em todas as páginas públicas
 * para manter a identidade visual consistente.
 * 
 * Estilização: Fundo azul (#11397a), responsivo para mobile e desktop
 */

export default function Header() {
  return (
    <section className="py-6 sm:py-10 text-center bg-[#11397a] px-4">
      <img src="/data/imagens/logo_sem_fundo.png" alt="Dominus Soli" className="mx-auto h-12 sm:h-16" />
      <h2 className="text-white text-lg sm:text-2xl mt-2 font-semibold">Assessoria em Leilão de Imóveis</h2>
      <p className="italic text-white text-sm sm:text-base mt-2 max-w-2xl mx-auto">
        Autoridade, estratégia e segurança no universo dos leilões de imóveis.
      </p>
    </section>
  );
}
