/**
 * CalculadoraViabilidade.jsx - Calculadora de Viabilidade de Investimento
 * 
 * Modal completo para simular a viabilidade financeira de um investimento
 * imobiliário em leilão. Permite ao usuário inserir todos os custos
 * envolvidos e calcular o retorno esperado.
 * 
 * Campos de entrada:
 * - Valor do imóvel (lance inicial)
 * - Dívidas Propter Rem (IPTU, condomínio atrasado)
 * - Custos: reforma, ITBI, registro, advocacia, outros
 * - Manutenção mensal e tempo até revenda
 * - Valor estimado de revenda
 * 
 * Cálculos realizados:
 * - Custo total do investimento
 * - Lucro projetado
 * - ROI (Return on Investment)
 * - ROI anualizado
 * - Margem de lucro
 * - Preço por m² (custo vs revenda)
 * 
 * Gráficos (Recharts):
 * - Pizza: Distribuição dos custos
 * - Barras: Comparação investimento vs retorno
 * - Linha: Evolução do custo ao longo do tempo
 * 
 * As simulações são salvas automaticamente via CalculadoraContext.
 * 
 * @param {Object} imovel - Imóvel sendo analisado (pré-preenche valores)
 * @param {Function} onClose - Callback para fechar o modal
 */

import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useCalculadora } from '../contexts/CalculadoraContext';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const COLORS = ['#11397a', '#e6b952', '#2563eb', '#dc2626', '#16a34a', '#9333ea'];

export default function CalculadoraViabilidade({ imovel, onClose }) {
  const { salvarSimulacao } = useCalculadora();
  
  const [valores, setValores] = useState({
    valorImovel: imovel?.preco || 0,
    dividasPropterRem: 0,
    custoReforma: 0,
    custoITBI: 0,
    custoRegistro: 0,
    custoAdvocacia: 0,
    outrosCustos: 0,
    valorRevendaEstimado: (imovel?.preco || 0) * 1.3,
    tempoRevenda: 12,
    custoManutencaoMensal: 0,
  });

  const [mostrarResultado, setMostrarResultado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValores(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calcularResultados = () => {
    const custoTotal = valores.valorImovel + valores.dividasPropterRem + valores.custoReforma + valores.custoITBI + 
                       valores.custoRegistro + valores.custoAdvocacia + valores.outrosCustos +
                       (valores.custoManutencaoMensal * valores.tempoRevenda);
    
    const lucro = valores.valorRevendaEstimado - custoTotal;
    const roi = ((lucro / custoTotal) * 100);
    const roiAnual = (roi / valores.tempoRevenda) * 12;
    const margemLucro = (lucro / valores.valorRevendaEstimado) * 100;
    const valorMetroQuadrado = valores.valorRevendaEstimado / (imovel?.tamanho_m2 || 1);
    const custoMetroQuadrado = custoTotal / (imovel?.tamanho_m2 || 1);
    
    return {
      custoTotal,
      lucro,
      roi,
      roiAnual,
      margemLucro,
      valorMetroQuadrado,
      custoMetroQuadrado,
    };
  };

  const resultados = calcularResultados();

  const handleCalcular = () => {
    setMostrarResultado(true);
    
    const simulacao = {
      imovelId: imovel?.id,
      imovelEndereco: imovel?.endereco || 'Simulação personalizada',
      imovelCidade: imovel?.cidade_estado || '-',
      valores: { ...valores },
      resultados: { ...resultados },
    };
    
    salvarSimulacao(simulacao);
  };

  const handleSalvarEFechar = () => {
    handleCalcular();
    setTimeout(() => onClose(), 500);
  };

  const dadosGraficoCustos = [
    { name: 'Valor Imóvel', value: valores.valorImovel },
    { name: 'Dívidas Propter Rem', value: valores.dividasPropterRem },
    { name: 'Reforma', value: valores.custoReforma },
    { name: 'ITBI', value: valores.custoITBI },
    { name: 'Registro', value: valores.custoRegistro },
    { name: 'Advocacia', value: valores.custoAdvocacia },
    { name: 'Manutenção', value: valores.custoManutencaoMensal * valores.tempoRevenda },
    { name: 'Outros', value: valores.outrosCustos },
  ].filter(item => item.value > 0);

  const dadosGraficoComparacao = [
    {
      name: 'Investimento',
      'Custo Total': resultados.custoTotal,
      'Valor Revenda': valores.valorRevendaEstimado,
      'Lucro': Math.max(0, resultados.lucro),
    },
  ];

  const dadosGraficoTempo = Array.from({ length: Math.ceil(valores.tempoRevenda) + 1 }, (_, i) => {
    const mes = i;
    const custoAcumulado = valores.valorImovel + valores.dividasPropterRem + valores.custoReforma + valores.custoITBI + 
                           valores.custoRegistro + valores.custoAdvocacia + valores.outrosCustos +
                           (valores.custoManutencaoMensal * mes);
    return {
      mes,
      'Custo Acumulado': custoAcumulado,
      'Valor de Revenda': i === Math.ceil(valores.tempoRevenda) ? valores.valorRevendaEstimado : 0,
    };
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl my-8 shadow-2xl">
        
        <div className="bg-gradient-to-r from-[#11397a] to-[#1e5bb8] text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">📊 Calculadora de Viabilidade</h2>
            {imovel && (
              <p className="text-sm sm:text-base opacity-90">
                {imovel.endereco} - {imovel.cidade_estado}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            title="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Investimento Inicial
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Valor do Imóvel
                </label>
                <input
                  type="number"
                  name="valorImovel"
                  value={valores.valorImovel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 250000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Dívidas Propter Rem (IPTU, condomínio em atraso, etc)
                </label>
                <input
                  type="number"
                  name="dividasPropterRem"
                  value={valores.dividasPropterRem}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 15000"
                />
                <p className="text-xs text-[#11397a]/60 mt-1">
                  Dívidas do imóvel pagas uma única vez na arrematação
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Custo de Reforma Estimado
                </label>
                <input
                  type="number"
                  name="custoReforma"
                  value={valores.custoReforma}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 30000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  ITBI (Imposto de Transmissão) - ~2-3%
                </label>
                <input
                  type="number"
                  name="custoITBI"
                  value={valores.custoITBI}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 7500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Custo de Registro em Cartório
                </label>
                <input
                  type="number"
                  name="custoRegistro"
                  value={valores.custoRegistro}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 3000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Honorários Advocatícios
                </label>
                <input
                  type="number"
                  name="custoAdvocacia"
                  value={valores.custoAdvocacia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Outros Custos (documentação, vistoria, etc)
                </label>
                <input
                  type="number"
                  name="outrosCustos"
                  value={valores.outrosCustos}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 2000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Projeção de Revenda
              </h3>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Valor Estimado de Revenda
                </label>
                <input
                  type="number"
                  name="valorRevendaEstimado"
                  value={valores.valorRevendaEstimado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 350000"
                />
                <p className="text-xs text-[#11397a]/60 mt-1">
                  Sugestão: {BRL.format(valores.valorImovel * 1.3)} (30% acima do valor inicial)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Tempo Estimado até Revenda (meses)
                </label>
                <input
                  type="number"
                  name="tempoRevenda"
                  value={valores.tempoRevenda}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 12"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#11397a] mb-1">
                  Custo de Manutenção Mensal (IPTU, condomínio, etc)
                </label>
                <input
                  type="number"
                  name="custoManutencaoMensal"
                  value={valores.custoManutencaoMensal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-[#c9d3e6] rounded-lg focus:border-[#11397a] focus:outline-none"
                  placeholder="Ex: 800"
                />
                <p className="text-xs text-[#11397a]/60 mt-1">
                  Total durante {valores.tempoRevenda} meses: {BRL.format(valores.custoManutencaoMensal * valores.tempoRevenda)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#11397a]/5 to-[#e6b952]/10 p-6 rounded-xl border-2 border-[#11397a]/20 mt-6">
                <h4 className="font-bold text-[#11397a] mb-4 text-lg">Resumo Rápido</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#11397a]/80">Investimento Total:</span>
                    <span className="font-bold text-[#11397a]">{BRL.format(resultados.custoTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#11397a]/80">Valor de Revenda:</span>
                    <span className="font-bold text-[#11397a]">{BRL.format(valores.valorRevendaEstimado)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#11397a]/20">
                    <span className="text-[#11397a]/80">Lucro Projetado:</span>
                    <span className={`font-bold text-lg ${resultados.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {BRL.format(resultados.lucro)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#11397a]/80">ROI (Retorno):</span>
                    <span className={`font-bold ${resultados.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {resultados.roi.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleCalcular}
              className="flex-1 bg-[#11397a] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#0e2f68] transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">🧮</span>
              Calcular Viabilidade
            </button>
            <button
              onClick={handleSalvarEFechar}
              className="flex-1 bg-[#e6b952] text-[#11397a] font-bold py-3 px-6 rounded-lg hover:bg-[#d4a842] transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">💾</span>
              Salvar e Fechar
            </button>
          </div>

          {mostrarResultado && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-gradient-to-r from-[#11397a] to-[#1e5bb8] text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  Análise de Viabilidade
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm opacity-90 mb-1">ROI Total</div>
                    <div className="text-2xl font-bold">{resultados.roi.toFixed(2)}%</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm opacity-90 mb-1">ROI Anual</div>
                    <div className="text-2xl font-bold">{resultados.roiAnual.toFixed(2)}%</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm opacity-90 mb-1">Margem de Lucro</div>
                    <div className="text-2xl font-bold">{resultados.margemLucro.toFixed(2)}%</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm opacity-90 mb-1">Lucro Estimado</div>
                    <div className="text-2xl font-bold">{BRL.format(resultados.lucro)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-[#11397a]/20 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-[#11397a] mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Distribuição de Custos
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dadosGraficoCustos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosGraficoCustos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => BRL.format(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border-2 border-[#11397a]/20 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-[#11397a] mb-4 flex items-center gap-2">
                    <span>💹</span>
                    Comparação: Investimento vs Retorno
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGraficoComparacao}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => BRL.format(value)} />
                      <Legend />
                      <Bar dataKey="Custo Total" fill="#dc2626" />
                      <Bar dataKey="Valor Revenda" fill="#16a34a" />
                      <Bar dataKey="Lucro" fill="#e6b952" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border-2 border-[#11397a]/20 rounded-xl p-6">
                <h4 className="text-lg font-bold text-[#11397a] mb-4 flex items-center gap-2">
                  <span>📈</span>
                  Evolução do Investimento ao Longo do Tempo
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosGraficoTempo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" label={{ value: 'Meses', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => BRL.format(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="Custo Acumulado" stroke="#dc2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="Valor de Revenda" stroke="#16a34a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-[#11397a] mb-4 flex items-center gap-2">
                  <span>💡</span>
                  Análise Detalhada
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-[#11397a] mb-2">Por Metro Quadrado:</div>
                    <div className="space-y-1 text-[#11397a]/80">
                      <div>• Custo: {BRL.format(resultados.custoMetroQuadrado)}/m²</div>
                      <div>• Revenda: {BRL.format(resultados.valorMetroQuadrado)}/m²</div>
                      <div>• Lucro: {BRL.format(resultados.valorMetroQuadrado - resultados.custoMetroQuadrado)}/m²</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#11397a] mb-2">Recomendação:</div>
                    <div className="text-[#11397a]/80">
                      {resultados.roi >= 30 && (
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 text-xl">✅</span>
                          <span>Excelente oportunidade! ROI acima de 30% indica alto potencial de lucro.</span>
                        </div>
                      )}
                      {resultados.roi >= 15 && resultados.roi < 30 && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 text-xl">👍</span>
                          <span>Boa oportunidade. ROI entre 15-30% é considerado satisfatório para investimentos imobiliários.</span>
                        </div>
                      )}
                      {resultados.roi >= 0 && resultados.roi < 15 && (
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600 text-xl">⚠️</span>
                          <span>ROI abaixo de 15%. Avalie se os custos podem ser reduzidos ou o valor de revenda aumentado.</span>
                        </div>
                      )}
                      {resultados.roi < 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 text-xl">❌</span>
                          <span>Atenção! Projeção de prejuízo. Revise os valores ou considere outras oportunidades.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
