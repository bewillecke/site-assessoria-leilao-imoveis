import "../index.css";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 bg-[#e6b952] border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-center gap-12 font-semibold">
        <a href="/" className="nav-underline text-[#11397a]">HOME</a>
        <a href="/quem_somos.html" className="nav-underline text-[#11397a]">QUEM SOMOS</a>
        <a href="/oportunidades.html" className="nav-underline text-[#11397a]">OPORTUNIDADES</a>
        <a href="/contato.html" className="nav-underline text-[#11397a]">CONTATOS</a>
      </div>
    </nav>
  );
}
