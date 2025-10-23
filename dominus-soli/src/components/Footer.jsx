export default function Footer() {
  return (
    <footer className="bg-[#11397a] text-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10">

  <ul className="flex items-center justify-center gap-36 mb-8">

          <li className="flex flex-col items-center">
            <a
              href="#"
              aria-label="Instagram"
              className="group inline-flex flex-col items-center"
              title="Instagram"
            >
              <span
                className="w-12 h-12 rounded-full shadow-lg ring-2 ring-white/20 grid place-items-center social-icon-instagram"
              >

                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM17.75 6a.75.75 0 1 1-.75.75A.75.75 0 0 1 17.75 6z" />
                </svg>
              </span>
              <span className="text-lg font-medium mt-2">Instagram</span>
            </a>
          </li>

          <li className="flex flex-col items-center">
            <a
              href="#"
              aria-label="Facebook"
              className="group inline-flex flex-col items-center"
              title="Facebook"
            >
              <span className="w-12 h-12 rounded-full shadow-lg ring-2 ring-white/20 grid place-items-center bg-[#1877F2] social-icon-facebook">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V8.3c0-.9.3-1.5 1.5-1.5H17V4.1C16.7 4.1 15.8 4 14.9 4c-2.4 0-4 1.5-4 4.1V11H8v3h2.9v8z" />
                </svg>
              </span>
              <span className="text-lg font-medium mt-2">Facebook</span>
            </a>
          </li>

          <li className="flex flex-col items-center">
            <a
              href="#"
              aria-label="WhatsApp"
              className="group inline-flex flex-col items-center"
              title="Whatsapp"
            >
              <span className="w-12 h-12 rounded-full shadow-lg ring-2 ring-white/20 grid place-items-center bg-[#25D366] social-icon-whatsapp">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <path d="M20 3.7A10 10 0 0 0 3.6 17.5L3 21l3.6-.9A10 10 0 1 0 20 3.7ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.4.6.6-2.3-.2-.3A8 8 0 1 1 12 20Zm4.7-5.9c-.3-.2-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1.1-.3.2-.5.1a6.8 6.8 0 0 1-2-1.2 7.6 7.6 0 0 1-1.4-1.7c-.2-.3 0-.4.1-.5l.3-.4c.1-.2.2-.3.2-.5a.5.5 0 0 0 0-.5c0-.2-.5-1.3-.7-1.7s-.4-.4-.6-.4h-.5a1 1 0 0 0-.8.4 3.1 3.1 0 0 0-1 2.3 5.5 5.5 0 0 0 1.2 2.8 12.5 12.5 0 0 0 4.7 4 5 5 0 0 0 3 1c.7 0 1.3-.3 1.7-.7a2.5 2.5 0 0 0 .5-1.6c0-.3 0-.4-.1-.5s-.2-.2-.5-.3Z" />
                </svg>
              </span>
              <span className="text-lg font-medium mt-2">Whatsapp</span>
            </a>
          </li>
        </ul>

        <div className="h-px bg-white/30 w-11/12 mx-auto mb-6" />

        <p className="text-center font-semibold">
          Todos os direitos reservados - <span className="font-bold">Dominus Soli</span> | Soraya Willecke e Ana Bek
        </p>
        <p className="text-center text-xs text-white/85 mt-2">
          Este site não é um produto Meta Platforms, Inc., Google LLC, tampouco oferece serviços públicos oficiais. Somos
          um escritório de advocacia.
        </p>
      </div>
    </footer>
  );
}
