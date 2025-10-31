import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BRL, formatDateBR } from "../utils/formatters";
import MapImoveis from '../components/MapImoveis';

export default function Oportunidades() {
  const [imoveis, setImoveis] = useState([]);
  const [precoMin, setPrecoMin] = useState(10000);
  const [precoMax, setPrecoMax] = useState(500000);
  const [m2Min, setM2Min] = useState(50);
  const [m2Max, setM2Max] = useState(200);
  const [cidade, setCidade] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false);
  const cidadeDropdownRef = useRef(null);

  const MIN_GAP_PRECO = 5000;
  const MIN_GAP_M2 = 5;

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
      .then((r) => r.json())
      .then((data) => setImoveis(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar imoveis.json", err));
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

  const filteredImoveis = imoveis.filter((x) => {
    const okPreco = Number(x.preco) >= precoMin && Number(x.preco) <= precoMax;
    const okM2 = Number(x.tamanho_m2) >= m2Min && Number(x.tamanho_m2) <= m2Max;
    const okCidade = !cidade || String(x.cidade_estado || "").toLowerCase().includes(cidade.toLowerCase());
    const okQuartos = !quartos || Number(x.quartos) === Number(quartos);
    const okBanheiros = !banheiros || Number(x.banheiros) === Number(banheiros);
    return okPreco && okM2 && okCidade && okQuartos && okBanheiros;
  });

  const handlePrecoMinChange = (e) => {
    const val = Math.min(Number(e.target.value), precoMax - MIN_GAP_PRECO);
    setPrecoMin(val);
  };

  const handlePrecoMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), precoMin + MIN_GAP_PRECO);
    setPrecoMax(val);
  };

  const handleM2MinChange = (e) => {
    const val = Math.min(Number(e.target.value), m2Max - MIN_GAP_M2);
    setM2Min(val);
  };

  const handleM2MaxChange = (e) => {
    const val = Math.max(Number(e.target.value), m2Min + MIN_GAP_M2);
    setM2Max(val);
  };

  const handleLimparFiltros = () => {
    setPrecoMin(10000);
    setPrecoMax(500000);
    setM2Min(50);
    setM2Max(200);
    setCidade("");
    setQuartos("");
    setBanheiros("");
  };

  const cidadesFiltered = cidades.filter((c) =>
    c.toLowerCase().includes(cidade.toLowerCase())
  );

  return (
    <>
      <Header />
      <Navbar />

      <section className="bg-white py-8">
        <div className="grid grid-cols-5 gap-5 mx-16 mb-6 max-w-7xl mx-auto px-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1">
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-[#11397a] font-bold mb-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#11397a] bg-blue-50 text-sm">💲</span>
              Preço
            </label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="1000"
              value={precoMin}
              onChange={handlePrecoMinChange}
              className="w-full"
            />
            <input
              type="range"
              min="10000"
              max="500000"
              step="1000"
              value={precoMax}
              onChange={handlePrecoMaxChange}
              className="w-full"
            />
            <div className="text-[#11397a] font-bold text-sm mt-2">
              {BRL.format(precoMin)} — {BRL.format(precoMax)}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-[#11397a] font-bold mb-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#11397a] bg-blue-50 text-sm">📐</span>
              Metros²
            </label>
            <input
              type="range"
              min="20"
              max="300"
              step="1"
              value={m2Min}
              onChange={handleM2MinChange}
              className="w-full"
            />
            <input
              type="range"
              min="20"
              max="300"
              step="1"
              value={m2Max}
              onChange={handleM2MaxChange}
              className="w-full"
            />
            <div className="text-[#11397a] font-bold text-sm mt-2">
              {m2Min} m² — {m2Max} m²
            </div>
          </div>

          <div className="flex flex-col relative" ref={cidadeDropdownRef}>
            <label className="flex items-center gap-2 text-[#11397a] font-bold mb-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#11397a] bg-blue-50 text-sm">📍</span>
              Cidade/UF
            </label>
            <input
              type="text"
              placeholder="Digite a cidade/UF"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              onFocus={() => setCidadeDropdownOpen(true)}
              onClick={() => setCidadeDropdownOpen(true)}
              className="w-full px-3 py-2 border-2 border-[#c9d3e6] rounded-lg bg-white text-[#11397a] font-semibold focus:border-[#11397a] focus:outline-none"
            />
            {cidadeDropdownOpen && cidadesFiltered.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-0 border-2 border-t-0 border-[#11397a] rounded-b-lg bg-white shadow-md z-50 max-h-48 overflow-y-auto">
                {cidadesFiltered.map((c, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setCidade(c);
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

          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-[#11397a] font-bold mb-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#11397a] bg-blue-50 text-sm">🛏️</span>
              Quartos
            </label>
            <input
              type="number"
              min="1"
              max="4"
              placeholder="Ex.: 2"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
              className="w-full px-3 py-2 border-2 border-[#c9d3e6] rounded-lg bg-white text-[#11397a] font-semibold focus:border-[#11397a] focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-[#11397a] font-bold mb-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#11397a] bg-blue-50 text-sm">🚿</span>
              Banheiros
            </label>
            <input
              type="number"
              min="1"
              max="3"
              placeholder="Ex.: 2"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
              className="w-full px-3 py-2 border-2 border-[#c9d3e6] rounded-lg bg-white text-[#11397a] font-semibold focus:border-[#11397a] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleLimparFiltros}
            className="bg-[#11397a] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#0e2f68] transition-colors"
          >
            Limpar filtros
          </button>
        </div>

        <MapImoveis imoveis={filteredImoveis} />

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl w-full px-4 mb-8">
            {filteredImoveis.length > 0 ? (
              filteredImoveis.map((imovel, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white border-2 border-[#11397a] rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-600 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={/^(http|\/)/.test(imovel.foto) ? imovel.foto : `/data/${imovel.foto}`}
                      alt={imovel.cidade_estado}
                      className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[#11397a] text-2xl font-bold text-center mt-4 px-4">
                    {BRL.format(Number(imovel.preco))}
                  </h3>
                  <p className="text-[#11397a] font-semibold mt-4 mx-4">{imovel.cidade_estado}</p>
                  <p className="text-[#11397a] text-sm mx-4">
                    {imovel.quartos} quarto(s) · {imovel.banheiros} banheiro(s)
                  </p>
                  <p className="text-[#11397a] text-sm mx-4">{imovel.tamanho_m2} m²</p>
                  <p className="text-[#11397a] text-sm mx-4 pb-4">
                    Data do leilão: {formatDateBR(imovel.data_leilao)}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-[#11397a] font-bold text-lg py-8">
                Nenhum imóvel encontrado com os filtros atuais.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
