/**
 * Simulacoes.jsx - Página de Histórico de Simulações
 * 
 * Página que exibe todas as simulações de viabilidade salvas pelo usuário.
 * As simulações são criadas na CalculadoraViabilidade e armazenadas
 * no CalculadoraContext (persistidas no localStorage).
 * 
 * Cada card de simulação mostra:
 * - Endereço e cidade do imóvel
 * - Data/hora da simulação
 * - Investimento total calculado
 * - Lucro estimado (verde/vermelho conforme positivo/negativo)
 * - ROI (Return on Investment)
 * - Detalhamento de custos
 * - Indicador visual de qualidade (excelente/bom/moderado/prejuízo)
 * 
 * Funcionalidades:
 * - Remover simulação individual
 * - Limpar todas as simulações
 * - Link para ver o imóvel original
 * - Grid responsivo (1/2/3 colunas)
 * 
 * Limite: Máximo de 10 simulações salvas (as mais antigas são removidas)
 */

import { useCalculadora } from '../contexts/CalculadoraContext';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BRL, formatDateBR } from '../utils/formatters';
import { Link } from 'react-router-dom';

export default function Simulacoes() {
  const { simulacoes, removerSimulacao, limparSimulacoes } = useCalculadora();

  const handleRemover = (id) => {
    if (window.confirm('Deseja realmente remover esta simulação?')) {
      removerSimulacao(id);
    }
  };

  const handleLimparTodas = () => {
    if (window.confirm('Deseja realmente remover todas as simulações? Esta ação não pode ser desfeita.')) {
      limparSimulacoes();
    }
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Header />
      <Navbar />

      <section className="bg-white py-8 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-[#11397a] text-3xl font-bold mb-2">📋 Minhas Simulações</h2>
              <p className="text-[#11397a]/70">
                {simulacoes.length === 0 
                  ? 'Nenhuma simulação salva ainda' 
                  : `${simulacoes.length} simulaç${simulacoes.length === 1 ? 'ão' : 'ões'} salva${simulacoes.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
            {simulacoes.length > 0 && (
              <button
                onClick={handleLimparTodas}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <span>🗑️</span>
                Limpar Todas
              </button>
            )}
          </div>

          {simulacoes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-[#11397a] mb-2">
                Nenhuma simulação realizada
              </h3>
              <p className="text-[#11397a]/70 mb-6">
                Acesse um imóvel e use a calculadora de viabilidade para começar!
              </p>
              <Link
                to="/oportunidades"
                className="inline-block bg-[#11397a] text-white px-6 py-3 rounded-lg hover:bg-[#0e2f68] transition-colors font-semibold"
              >
                Ver Oportunidades
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {simulacoes.map((simulacao) => (
                <div
                  key={simulacao.id}
                  className="bg-white border-2 border-[#11397a]/20 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  
                  <div className="bg-gradient-to-r from-[#11397a] to-[#1e5bb8] text-white p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg line-clamp-2 flex-1">
                        {simulacao.imovelEndereco}
                      </h3>
                      <button
                        onClick={() => handleRemover(simulacao.id)}
                        className="ml-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                        title="Remover simulação"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm opacity-90">{simulacao.imovelCidade}</p>
                    <p className="text-xs opacity-75 mt-2">
                      {formatarData(simulacao.data)}
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-[#11397a]/60 mb-1">Investimento Total</div>
                      <div className="text-xl font-bold text-[#11397a]">
                        {BRL.format(simulacao.resultados.custoTotal)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xs text-[#11397a]/60 mb-1">Lucro Estimado</div>
                        <div className={`text-lg font-bold ${simulacao.resultados.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {BRL.format(simulacao.resultados.lucro)}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xs text-[#11397a]/60 mb-1">ROI</div>
                        <div className={`text-lg font-bold ${simulacao.resultados.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {simulacao.resultados.roi.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-1 text-sm text-[#11397a]/70">
                      <div className="flex justify-between">
                        <span>Valor do Imóvel:</span>
                        <span className="font-semibold text-[#11397a]">{BRL.format(simulacao.valores.valorImovel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dívidas Propter Rem:</span>
                        <span className="font-semibold text-[#11397a]">{BRL.format(simulacao.valores.dividasPropterRem || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reforma:</span>
                        <span className="font-semibold text-[#11397a]">{BRL.format(simulacao.valores.custoReforma)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outros Custos:</span>
                        <span className="font-semibold text-[#11397a]">
                          {BRL.format(
                            simulacao.valores.custoITBI + 
                            simulacao.valores.custoRegistro + 
                            simulacao.valores.custoAdvocacia + 
                            simulacao.valores.outrosCustos +
                            (simulacao.valores.custoManutencaoMensal * simulacao.valores.tempoRevenda)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span>Valor de Revenda:</span>
                        <span className="font-bold text-[#11397a]">{BRL.format(simulacao.valores.valorRevendaEstimado)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo até Revenda:</span>
                        <span className="font-semibold text-[#11397a]">{simulacao.valores.tempoRevenda} meses</span>
                      </div>
                    </div>

                    <div className="pt-3">
                      {simulacao.resultados.roi >= 30 && (
                        <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                          <span>✅</span>
                          <span className="font-semibold">Excelente oportunidade!</span>
                        </div>
                      )}
                      {simulacao.resultados.roi >= 15 && simulacao.resultados.roi < 30 && (
                        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                          <span>👍</span>
                          <span className="font-semibold">Boa oportunidade</span>
                        </div>
                      )}
                      {simulacao.resultados.roi >= 0 && simulacao.resultados.roi < 15 && (
                        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                          <span>⚠️</span>
                          <span className="font-semibold">ROI moderado</span>
                        </div>
                      )}
                      {simulacao.resultados.roi < 0 && (
                        <div className="bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                          <span>❌</span>
                          <span className="font-semibold">Atenção: Prejuízo projetado</span>
                        </div>
                      )}
                    </div>

                    {simulacao.imovelId && (
                      <Link
                        to={`/imovel/${simulacao.imovelId}`}
                        className="block w-full bg-[#e6b952] text-[#11397a] text-center font-bold py-2 rounded-lg hover:bg-[#d4a842] transition-colors mt-3"
                      >
                        Ver Imóvel
                      </Link>
                    )}
                  </div>
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
