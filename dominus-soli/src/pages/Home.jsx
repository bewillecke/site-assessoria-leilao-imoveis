import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { shufflePick } from "../utils/formatters";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Carousel from "../components/Carousel.jsx";
import About from "../components/About.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const [imoveis, setImoveis] = useState([]);
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [precoMaxBusca, setPrecoMaxBusca] = useState(500000);
  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false);
  const cidadeDropdownRef = useRef(null);
  const navigate = useNavigate();

  const cidades = [
    "São Paulo/SP",
    "Rio de Janeiro/RJ",
    "Belo Horizonte/MG",
    "Porto Alegre/RS",
    "Curitiba/PR",
    "Campinas/SP",
    "Florianópolis/SC",
    "Salvador/BA",
    "Fortaleza/CE",
    "Manaus/AM",
    "Recife/PE",
    "Vitória/ES",
    "Belém/PA",
    "Goiânia/GO",
    "Natal/RN",
    "Campo Grande/MS",
  ];

  useEffect(() => {
    fetch("/imoveis.json")
      .then(r => r.json())
      .then(data => setImoveis(shufflePick(data, 8)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cidadeDropdownRef.current && !cidadeDropdownRef.current.contains(event.target)) {
        setCidadeDropdownOpen(false);
      }
    };

    if (cidadeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [cidadeDropdownOpen]);

  const cidadesFiltered = cidades.filter((c) =>
    c.toLowerCase().includes(cidadeBusca.toLowerCase())
  );

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (cidadeBusca) params.set('cidade', cidadeBusca);
    if (precoMaxBusca !== 500000) params.set('precoMax', precoMaxBusca);
    navigate(`/oportunidades?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <Navbar />

      <section className="bg-gradient-to-b from-[#11397a]/5 to-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#11397a] text-2xl sm:text-3xl font-extrabold text-center mb-3">
            Encontre seu Imóvel em Leilão
          </h2>
          <p className="text-[#11397a]/70 text-center mb-6 sm:mb-8 text-sm sm:text-base">
            Busque imóveis com até 50% de desconto em relação ao mercado
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-[#11397a]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="relative" ref={cidadeDropdownRef}>
                <label className="text-[#11397a] font-bold mb-2 block">
                  🏙️ Cidade/Estado
                </label>
                <input
                  type="text"
                  placeholder="Digite a cidade/UF"
                  value={cidadeBusca}
                  onChange={(e) => setCidadeBusca(e.target.value)}
                  onFocus={() => setCidadeDropdownOpen(true)}
                  onClick={() => setCidadeDropdownOpen(true)}
                  className="w-full px-4 py-3 border-2 border-[#c9d3e6] rounded-lg bg-white text-[#11397a] font-semibold focus:border-[#11397a] focus:outline-none"
                />
                {cidadeDropdownOpen && cidadesFiltered.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-0 border-2 border-t-0 border-[#11397a] rounded-b-lg bg-white shadow-md z-50 max-h-48 overflow-y-auto">
                    {cidadesFiltered.map((c, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setCidadeBusca(c);
                          setCidadeDropdownOpen(false);
                        }}
                        className="px-3 py-2 text-[#11397a] font-semibold cursor-pointer hover:bg-blue-50"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div>
                <label className="text-[#11397a] font-bold mb-2 block">
                  💰 Preço máximo: R$ {precoMaxBusca.toLocaleString('pt-BR')}
                </label>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="10000"
                  value={precoMaxBusca}
                  onChange={(e) => setPrecoMaxBusca(Number(e.target.value))}
                  className="w-full h-3 bg-[#11397a]/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <button
              onClick={handleBuscar}
              className="w-full bg-[#e6b952] text-[#11397a] font-bold text-lg py-4 rounded-lg hover:bg-[#d4a842] transition-colors shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              🔍 Buscar Imóveis
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#11397a] text-2xl sm:text-3xl font-extrabold text-center mb-3 sm:mb-4">
            Por que Investir em Leilões de Imóveis?
          </h2>
          <p className="text-[#11397a]/70 text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Descubra as vantagens de adquirir imóveis através de leilões judiciais e extrajudiciais
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-[#11397a]/5 to-white rounded-2xl p-6 sm:p-8 border-2 border-[#11397a]/10 hover:border-[#e6b952] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#e6b952] rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto">
                💰
              </div>
              <h3 className="text-[#11397a] text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">
                Descontos de até 50%
              </h3>
              <p className="text-[#11397a]/80 text-center leading-relaxed text-sm sm:text-base">
                Imóveis em leilão são vendidos abaixo do valor de mercado, oferecendo excelente oportunidade de investimento com alto potencial de rentabilidade.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#11397a]/5 to-white rounded-2xl p-6 sm:p-8 border-2 border-[#11397a]/10 hover:border-[#e6b952] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#e6b952] rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto">
                🛡️
              </div>
              <h3 className="text-[#11397a] text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">
                Segurança Jurídica
              </h3>
              <p className="text-[#11397a]/80 text-center leading-relaxed text-sm sm:text-base">
                Processos regulados pela Justiça garantem transparência e segurança. Nossa equipe analisa toda documentação para evitar problemas futuros.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#11397a]/5 to-white rounded-2xl p-6 sm:p-8 border-2 border-[#11397a]/10 hover:border-[#e6b952] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#e6b952] rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto">
                🎯
              </div>
              <h3 className="text-[#11397a] text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">
                Menos Concorrência
              </h3>
              <p className="text-[#11397a]/80 text-center leading-relaxed text-sm sm:text-base">
                Muitos investidores têm receio de leilões. Com nossa assessoria especializada, você tem vantagem competitiva e acesso a oportunidades únicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#11397a] to-[#0e2f68]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-12">
            Resultados que Comprovam Nossa Experiência
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-extrabold text-[#e6b952] mb-1 sm:mb-2">150+</div>
              <div className="text-white/90 font-semibold text-sm sm:text-base">Imóveis Assessorados</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-extrabold text-[#e6b952] mb-1 sm:mb-2">98%</div>
              <div className="text-white/90 font-semibold text-sm sm:text-base">Clientes Satisfeitos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-extrabold text-[#e6b952] mb-1 sm:mb-2">5+</div>
              <div className="text-white/90 font-semibold text-sm sm:text-base">Anos de Experiência</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-extrabold text-[#e6b952] mb-1 sm:mb-2">R$ 45M</div>
              <div className="text-white/90 font-semibold text-sm sm:text-base">Em Negócios Realizados</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#11397a] text-xl sm:text-2xl lg:text-[2rem] font-extrabold mb-10 text-center">
            Imóveis em Destaque
          </h2>
        </div>
        <div className="pb-0 mb-0">
          <Carousel items={imoveis} />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#11397a] text-2xl sm:text-3xl font-extrabold text-center mb-3 sm:mb-4">
            Como Funciona Nossa Assessoria
          </h2>
          <p className="text-[#11397a]/70 text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Acompanhamos você em cada etapa do processo de aquisição
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-[#11397a] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-[#11397a] text-lg font-bold text-center mb-2">
                Análise de Perfil
              </h3>
              <p className="text-[#11397a]/80 text-center text-sm leading-relaxed">
                Entendemos suas necessidades, objetivos e capacidade de investimento para encontrar as melhores oportunidades.
              </p>
            </div>

            <div className="relative">
              <div className="bg-[#11397a] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-[#11397a] text-lg font-bold text-center mb-2">
                Seleção de Imóveis
              </h3>
              <p className="text-[#11397a]/80 text-center text-sm leading-relaxed">
                Filtramos e apresentamos imóveis que atendem seus critérios, com análise completa de documentação e riscos.
              </p>
            </div>

            <div className="relative">
              <div className="bg-[#11397a] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-[#11397a] text-lg font-bold text-center mb-2">
                Participação no Leilão
              </h3>
              <p className="text-[#11397a]/80 text-center text-sm leading-relaxed">
                Orientamos sobre estratégia de lances, valores e acompanhamos você durante todo o processo do leilão.
              </p>
            </div>

            <div className="relative">
              <div className="bg-[#e6b952] text-[#11397a] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                4
              </div>
              <h3 className="text-[#11397a] text-lg font-bold text-center mb-2">
                Pós-Leilão
              </h3>
              <p className="text-[#11397a]/80 text-center text-sm leading-relaxed">
                Auxiliamos na documentação, regularização e entrega do imóvel. Seu sucesso é nossa prioridade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-[-1.5rem]">
        <About />
      </div>

      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#11397a]/5 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-[#11397a] text-2xl sm:text-3xl font-extrabold text-center mb-3 sm:mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-[#11397a]/70 text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Histórias reais de quem confiou na Dominus Soli
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-[#e6b952] text-2xl sm:text-3xl mb-2 sm:mb-3">★★★★★</div>
              <p className="text-[#11397a] italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                "Consegui um apartamento em Copacabana por 40% abaixo do valor de mercado. A equipe foi essencial em todo o processo!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#11397a] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  MC
                </div>
                <div>
                  <div className="text-[#11397a] font-bold text-sm sm:text-base">Marcos Costa</div>
                  <div className="text-[#11397a]/60 text-xs sm:text-sm">Investidor - RJ</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-[#e6b952] text-2xl sm:text-3xl mb-2 sm:mb-3">★★★★★</div>
              <p className="text-[#11397a] italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                "Profissionais extremamente competentes. Me deram toda segurança jurídica que eu precisava para investir em leilões."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#11397a] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  AS
                </div>
                <div>
                  <div className="text-[#11397a] font-bold text-sm sm:text-base">Ana Silva</div>
                  <div className="text-[#11397a]/60 text-xs sm:text-sm">Empresária - SP</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-[#e6b952] text-2xl sm:text-3xl mb-2 sm:mb-3">★★★★★</div>
              <p className="text-[#11397a] italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                "Assessoria impecável! Comprei minha primeira casa através de leilão e foi muito mais fácil do que imaginava."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#11397a] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  RF
                </div>
                <div>
                  <div className="text-[#11397a] font-bold text-sm sm:text-base">Roberto Fonseca</div>
                  <div className="text-[#11397a]/60 text-xs sm:text-sm">Engenheiro - MG</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-r from-[#11397a] to-[#0e2f68]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">
            Pronto para Encontrar sua Oportunidade?
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudá-lo a conquistar o imóvel dos seus sonhos com segurança e economia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate('/oportunidades')}
              className="bg-[#e6b952] text-[#11397a] font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[#d4a842] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Ver Oportunidades
            </button>
            <button
              onClick={() => navigate('/contato')}
              className="bg-white text-[#11397a] font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
