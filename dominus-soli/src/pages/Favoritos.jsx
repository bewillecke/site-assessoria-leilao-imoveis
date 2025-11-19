import { useFavoritos } from "../contexts/FavoritosContext";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BRL, formatDateBR } from "../utils/formatters";

export default function Favoritos() {
  const { favoritos, toggleFavorito, isFavorito, limparFavoritos } = useFavoritos();

  return (
    <>
      <Header />
      <Navbar />

      <section className="bg-white py-6 sm:py-8 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-[#11397a] text-2xl sm:text-3xl font-bold">
                Meus Favoritos
              </h1>
              <p className="text-[#11397a]/70 text-sm sm:text-base mt-2">
                {favoritos.length} {favoritos.length === 1 ? 'imóvel salvo' : 'imóveis salvos'}
              </p>
            </div>

            {favoritos.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente remover todos os favoritos?')) {
                    limparFavoritos();
                  }
                }}
                className="bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                🗑️ Limpar Favoritos
              </button>
            )}
          </div>

          {favoritos.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl sm:text-8xl mb-4">❤️</div>
              <h2 className="text-[#11397a] text-xl sm:text-2xl font-bold mb-3">
                Nenhum favorito ainda
              </h2>
              <p className="text-[#11397a]/70 mb-6 text-sm sm:text-base">
                Explore nossos imóveis e salve seus favoritos clicando no ❤️
              </p>
              <Link
                to="/oportunidades"
                className="inline-block bg-[#11397a] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#0e2f68] transition-colors"
              >
                Ver Oportunidades
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {favoritos.map((imovel) => (
                <div
                  key={imovel.id}
                  className="flex flex-col bg-white border-2 border-[#11397a] rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorito(imovel);
                    }}
                    className="absolute top-3 left-3 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all bg-red-500 text-white hover:bg-red-600"
                    title="Remover dos favoritos"
                  >
                    ❤️
                  </button>

                  <Link to={`/imovel/${imovel.id}`} className="flex flex-col flex-1">
                    <div className="aspect-video sm:aspect-square overflow-hidden">
                      <img
                        src={/^(http|\/)/.test(imovel.foto) ? imovel.foto : `/data/${imovel.foto}`}
                        alt={imovel.cidade_estado}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <h3 className="text-[#11397a] text-xl sm:text-2xl font-bold text-center mt-3 sm:mt-4 px-4">
                      {BRL.format(Number(imovel.preco))}
                    </h3>
                    <p className="text-[#11397a] font-semibold mt-2 sm:mt-4 mx-4 text-sm sm:text-base">
                      {imovel.cidade_estado}
                    </p>
                    <p className="text-[#11397a] text-xs sm:text-sm mx-4 mt-1">
                      {imovel.quartos} quarto(s) · {imovel.banheiros} banheiro(s)
                    </p>
                    <p className="text-[#11397a] text-xs sm:text-sm mx-4">{imovel.tamanho_m2} m²</p>
                    <p className="text-[#11397a] text-xs sm:text-sm mx-4 mb-3">
                      Data do leilão: {formatDateBR(imovel.data_leilao)}
                    </p>
                    <button className="mx-4 mt-auto mb-3 sm:mb-4 bg-[#e6b952] text-[#11397a] font-bold py-2 rounded-lg hover:bg-[#d4a842] transition-colors text-sm sm:text-base">
                      Ver Detalhes
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
