import "../index.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 bg-[#e6b952] border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-center gap-12 font-semibold">
        <Link to="/" className="nav-underline text-[#11397a]">HOME</Link>
        <Link to="/quem-somos" className="nav-underline text-[#11397a]">QUEM SOMOS</Link>
        <Link to="/oportunidades" className="nav-underline text-[#11397a]">OPORTUNIDADES</Link>
        <Link to="/contato" className="nav-underline text-[#11397a]">CONTATOS</Link>
      </div>
    </nav>
  );
}
