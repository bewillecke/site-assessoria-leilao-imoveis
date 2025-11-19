import "../index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFavoritos } from "../contexts/FavoritosContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalFavoritos } = useFavoritos();

  return (
    <nav className="sticky top-0 z-20 bg-[#e6b952] border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12 font-semibold">
          <Link to="/" className="nav-underline text-[#11397a]">HOME</Link>
          <Link to="/quem-somos" className="nav-underline text-[#11397a]">QUEM SOMOS</Link>
          <Link to="/oportunidades" className="nav-underline text-[#11397a]">OPORTUNIDADES</Link>
          <Link to="/favoritos" className="nav-underline text-[#11397a] relative">
            FAVORITOS
            {totalFavoritos > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalFavoritos}
              </span>
            )}
          </Link>
          <Link to="/simulacoes" className="nav-underline text-[#11397a]">SIMULAÇÕES</Link>
          <Link to="/estatisticas" className="nav-underline text-[#11397a]">ESTATÍSTICAS</Link>
          <Link to="/contato" className="nav-underline text-[#11397a]">CONTATOS</Link>
        </div>

        <div className="md:hidden flex items-center justify-between">
          <span className="text-[#11397a] font-bold text-lg">Menu</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#11397a] p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 space-y-2 pb-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors"
            >
              HOME
            </Link>
            <Link
              to="/quem-somos"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors"
            >
              QUEM SOMOS
            </Link>
            <Link
              to="/oportunidades"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors"
            >
              OPORTUNIDADES
            </Link>
            <Link
              to="/favoritos"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors relative"
            >
              FAVORITOS
              {totalFavoritos > 0 && (
                <span className="absolute top-2 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalFavoritos}
                </span>
              )}
            </Link>
            <Link
              to="/simulacoes"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors"
            >
              SIMULAÇÕES
            </Link>
            <Link
              to="/estatisticas"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors"
            >
              ESTATÍSTICAS
            </Link>
            <Link
              to="/contato"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[#11397a] font-semibold hover:bg-[#d4a842] rounded transition-colors"
            >
              CONTATOS
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
