export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-8 text-[#11397a]">
        <div className="flex gap-10">
          <div className="text-center">
            <a href="#" className="text-2xl">📷</a>
            <h3>Instagram</h3>
          </div>
          <div className="text-center">
            <a href="#" className="text-2xl">f</a>
            <h3>Facebook</h3>
          </div>
          <div className="text-center">
            <a href="#" className="text-2xl">🟢</a>
            <h3>Whatsapp</h3>
          </div>
        </div>

        <hr className="my-6" />

        <h5 className="font-semibold">
          Todos os direitos reservados - Dominus Soli | Soraya Willecke e Ana Bek
        </h5>

        <p className="mt-2 text-sm">
          Este site não é um produto Meta Platforms, Inc., Google LLC, tampouco oferece serviços
          públicos oficiais. Somos um escritório de advocacia…
        </p>
      </div>
    </footer>
  );
}
