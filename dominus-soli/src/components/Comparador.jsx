import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRL, formatDateBR } from '../utils/formatters';

export default function Comparador({ imoveis, onClose }) {
  if (imoveis.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-[#11397a] p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold">Comparar Imóveis</h2>
            <p className="text-white/80 text-sm sm:text-base mt-1">
              {imoveis.length} {imoveis.length === 1 ? 'imóvel selecionado' : 'imóveis selecionados'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#e6b952] transition-colors text-2xl sm:text-3xl font-bold"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="overflow-auto flex-1 p-3 sm:p-6">
          <div className={`grid grid-cols-1 ${imoveis.length >= 2 ? 'md:grid-cols-2' : ''} ${imoveis.length >= 3 ? 'lg:grid-cols-3' : ''} gap-4 sm:gap-6`}>
            {imoveis.map((imovel) => (
              <div key={imovel.id} className="border-2 border-[#11397a]/20 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={`/data/${imovel.foto}`}
                    alt={imovel.cidade_estado}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300?text=Imagem')}
                  />
                </div>

                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                  <div>
                    <div className="text-[#11397a] font-bold text-lg sm:text-xl mb-1">
                      {imovel.cidade_estado}
                    </div>
                    <div className="text-[#11397a]/70 text-xs sm:text-sm">
                      📍 {imovel.endereco}
                    </div>
                  </div>

                  <div className="bg-[#e6b952]/10 rounded-lg p-3 sm:p-4 border-2 border-[#e6b952]">
                    <div className="text-[#11397a]/70 text-xs sm:text-sm font-semibold mb-1">
                      VALOR DO LEILÃO
                    </div>
                    <div className="text-[#11397a] text-2xl sm:text-3xl font-extrabold">
                      {BRL.format(Number(imovel.preco))}
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between items-center py-2 border-b border-[#11397a]/10">
                      <span className="text-[#11397a]/70 font-semibold">📏 Área</span>
                      <span className="text-[#11397a] font-bold">{imovel.tamanho_m2} m²</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#11397a]/10">
                      <span className="text-[#11397a]/70 font-semibold">🛏️ Quartos</span>
                      <span className="text-[#11397a] font-bold">{imovel.quartos}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#11397a]/10">
                      <span className="text-[#11397a]/70 font-semibold">🚿 Banheiros</span>
                      <span className="text-[#11397a] font-bold">{imovel.banheiros}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#11397a]/10">
                      <span className="text-[#11397a]/70 font-semibold">📅 Data do Leilão</span>
                      <span className="text-[#11397a] font-bold">{formatDateBR(imovel.data_leilao)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#11397a]/10">
                      <span className="text-[#11397a]/70 font-semibold">💰 Preço/m²</span>
                      <span className="text-[#11397a] font-bold">
                        {BRL.format(Math.round(Number(imovel.preco) / Number(imovel.tamanho_m2)))}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/imovel/${imovel.id}`}
                    onClick={onClose}
                    className="block w-full bg-[#11397a] text-white text-center font-bold py-3 rounded-lg hover:bg-[#0e2f68] transition-colors"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
