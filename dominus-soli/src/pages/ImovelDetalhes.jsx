import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CalculadoraViabilidade from "../components/CalculadoraViabilidade";
import { BRL, formatDateBR } from "../utils/formatters";
import { useFavoritos } from "../contexts/FavoritosContext";
import { useAnalytics } from "../contexts/AnalyticsContext";

export default function ImovelDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const { registrarVisualizacao, registrarFavorito } = useAnalytics();
  const [imovel, setImovel] = useState(null);
  const [imoveisSimilares, setImoveisSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);

  useEffect(() => {
    fetch("/imoveis.json")
      .then((r) => r.json())
      .then((data) => {
        const imovelEncontrado = data.find((im) => im.id === Number(id));
        if (imovelEncontrado) {
          setImovel(imovelEncontrado);
          registrarVisualizacao(imovelEncontrado.id);
          
          const similares = data
            .filter((im) => 
              im.id !== Number(id) && 
              im.cidade_estado === imovelEncontrado.cidade_estado
            )
            .slice(0, 3);
          setImoveisSimilares(similares);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const calcularPorMetro = () => {
    if (!imovel) return 0;
    return imovel.preco / imovel.tamanho_m2;
  };

  const compartilhar = (plataforma) => {
    const url = window.location.href;
    const texto = `Confira este imóvel em leilão: ${imovel.endereco}, ${imovel.cidade_estado}`;
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent("Imóvel em Leilão")}&body=${encodeURIComponent(texto + " " + url)}`
    };

    window.open(urls[plataforma], "_blank");
  };

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-[#11397a] text-xl">Carregando...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!imovel) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold text-[#11397a] mb-4">Imóvel não encontrado</h1>
          <button
            onClick={() => navigate("/oportunidades")}
            className="bg-[#11397a] text-white px-6 py-3 rounded-lg hover:bg-[#0e2f68] transition-colors"
          >
            Ver todas as oportunidades
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <nav className="text-sm mb-6 text-[#11397a]">
          <Link to="/" className="hover:underline">Home</Link>
          {" > "}
          <Link to="/oportunidades" className="hover:underline">Oportunidades</Link>
          {" > "}
          <span className="font-semibold">{imovel.cidade_estado}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <img
                src={/^(http|\/)/.test(imovel.foto) ? imovel.foto : `/data/${imovel.foto}`}
                alt={imovel.endereco}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-[#11397a] font-bold mb-3">Compartilhar este imóvel:</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const eraFavorito = isFavorito(imovel.id);
                    toggleFavorito(imovel);
                    registrarFavorito(imovel.id, eraFavorito ? 'remover' : 'adicionar');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorito(imovel.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-300'
                  }`}
                >
                  <span className="text-xl">❤️</span>
                  {isFavorito(imovel.id) ? 'Remover favorito' : 'Adicionar favorito'}
                </button>
                <button
                  onClick={() => compartilhar("whatsapp")}
                  className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#1fb855] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => compartilhar("facebook")}
                  className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-lg hover:bg-[#145dbf] transition-colors"
                >
                  Facebook
                </button>
                <button
                  onClick={() => compartilhar("email")}
                  className="flex items-center gap-2 bg-[#11397a] text-white px-4 py-2 rounded-lg hover:bg-[#0e2f68] transition-colors"
                >
                  E-mail
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#11397a]/20">
              <h1 className="text-3xl font-extrabold text-[#11397a] mb-2">
                {BRL.format(imovel.preco)}
              </h1>
              <p className="text-lg text-[#11397a]/70 mb-6">
                {BRL.format(calcularPorMetro())}/m²
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#e6b952] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-[#11397a]">{imovel.cidade_estado}</p>
                    <p className="text-[#11397a]/80">{imovel.endereco}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#11397a]/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#11397a]">{imovel.tamanho_m2}</div>
                    <div className="text-sm text-[#11397a]/70">m²</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#11397a]">{imovel.quartos}</div>
                    <div className="text-sm text-[#11397a]/70">Quartos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#11397a]">{imovel.banheiros}</div>
                    <div className="text-sm text-[#11397a]/70">Banheiros</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#e6b952] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-bold text-[#11397a]">Data do Leilão</p>
                    <p className="text-[#11397a]/80">{formatDateBR(imovel.data_leilao)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/contato"
                  className="block w-full bg-[#e6b952] text-[#11397a] font-bold text-center px-6 py-4 rounded-lg hover:bg-[#d4a842] transition-colors"
                >
                  Solicitar Assessoria
                </Link>
                <button
                  onClick={() => setMostrarCalculadora(true)}
                  className="w-full bg-gradient-to-r from-[#11397a] to-[#1e5bb8] text-white font-bold py-4 px-6 rounded-lg hover:from-[#0e2f68] hover:to-[#164a9f] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">📊</span>
                  Calcular Viabilidade do Investimento
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-white border-2 border-[#11397a] text-[#11397a] font-bold px-6 py-3 rounded-lg hover:bg-[#11397a] hover:text-white transition-colors"
                >
                  Imprimir Detalhes
                </button>
              </div>
            </div>

            <div className="bg-[#f8f9fa] rounded-2xl shadow-lg p-6 border border-[#11397a]/20 mt-6">
              <h3 className="text-xl font-bold text-[#11397a] mb-4">Simule seu Investimento</h3>
              <div className="space-y-3 text-[#11397a]">
                <div className="flex justify-between">
                  <span>Valor do imóvel:</span>
                  <span className="font-bold">{BRL.format(imovel.preco)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrada (20%):</span>
                  <span className="font-bold">{BRL.format(imovel.preco * 0.2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo a financiar:</span>
                  <span className="font-bold">{BRL.format(imovel.preco * 0.8)}</span>
                </div>
                <div className="pt-3 border-t border-[#11397a]/20">
                  <div className="flex justify-between text-sm">
                    <span>Parcela estimada (84x):</span>
                    <span className="font-bold text-lg">{BRL.format((imovel.preco * 0.8) / 84)}</span>
                  </div>
                  <p className="text-xs text-[#11397a]/60 mt-2">
                    *Simulação aproximada. Consulte condições reais de financiamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {imovel.latitude && imovel.longitude && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#11397a] mb-4">Localização</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: "400px" }}>
              <MapContainer
                center={[imovel.latitude, imovel.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[imovel.latitude, imovel.longitude]}>
                  <Popup>
                    <strong>{imovel.endereco}</strong>
                    <br />
                    {imovel.cidade_estado}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-[#11397a]/20">
          <h2 className="text-2xl font-bold text-[#11397a] mb-4">Sobre este imóvel</h2>
          <div className="text-[#11397a] space-y-4">
            <p>
              Este imóvel está disponível para leilão e representa uma excelente oportunidade de investimento.
              Localizado em {imovel.cidade_estado}, no endereço {imovel.endereco}, o imóvel possui {imovel.tamanho_m2}m²
              de área total, com {imovel.quartos} quarto(s) e {imovel.banheiros} banheiro(s).
            </p>
            <p>
              O leilão está marcado para <strong>{formatDateBR(imovel.data_leilao)}</strong>, com lance inicial
              de <strong>{BRL.format(imovel.preco)}</strong>, o que representa um valor
              de <strong>{BRL.format(calcularPorMetro())}/m²</strong>.
            </p>
            <p>
              Nossa assessoria especializada pode auxiliá-lo em todas as etapas do processo de arrematação,
              desde a análise documental até a regularização final do imóvel. Entre em contato para mais informações.
            </p>
          </div>
        </div>

        {imoveisSimilares.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#11397a] mb-6">Imóveis Similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {imoveisSimilares.map((im) => (
                <Link
                  key={im.id}
                  to={`/imovel/${im.id}`}
                  className="bg-white border border-[#11397a] rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={/^(http|\/)/.test(im.foto) ? im.foto : `/data/${im.foto}`}
                      alt={im.cidade_estado}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#11397a] text-xl font-bold">
                      {BRL.format(im.preco)}
                    </h3>
                    <p className="text-[#11397a] mt-2">{im.cidade_estado}</p>
                    <p className="text-[#11397a]/70 text-sm mt-1">
                      {im.quartos} quartos • {im.banheiros} banheiros • {im.tamanho_m2}m²
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {mostrarCalculadora && (
        <CalculadoraViabilidade 
          imovel={imovel}
          onClose={() => setMostrarCalculadora(false)}
        />
      )}

      <Footer />
    </>
  );
}
