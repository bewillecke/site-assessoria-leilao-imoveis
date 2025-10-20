export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-6 text-[#11397a] font-semibold">
        <a href="/">HOME</a>
        <a href="/quem_somos.html">QUEM SOMOS</a>
        <a href="/oportunidades.html">OPORTUNIDADES</a>
        <a href="/contato.html">CONTATOS</a>
      </div>
    </nav>
  );
}
