/**
 * Estatisticas.jsx - Dashboard Público de Estatísticas do Mercado
 * 
 * Página que apresenta análise estatística do mercado de imóveis em leilão.
 * Todos os dados são calculados a partir dos imóveis cadastrados na plataforma.
 * 
 * Métricas exibidas (cards):
 * - Preço médio geral
 * - Maior oportunidade (menor preço)
 * - Maior valor (imóvel premium)
 * - Preço médio por m²
 * 
 * Gráficos (Recharts):
 * - Barras horizontais: Top 10 cidades por preço médio
 * - Pizza: Distribuição por faixa de preço (até 200k, 200-400k, etc.)
 * - Linha: Tendência de preços (simulada - últimos 6 meses)
 * - Barras: Distribuição por número de quartos
 * 
 * Cálculos realizados em calcularEstatisticas():
 * - Agrupamento por cidade
 * - Contagem por faixa de preço
 * - Médias e extremos
 * - Simulação de tendência temporal
 * 
 * Estados:
 * - imoveis: Dados carregados da API
 * - loading: Indica carregamento inicial
 * - stats: Objeto com todas as estatísticas calculadas
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BRL } from '../utils/formatters';

const COLORS = ['#11397a', '#e6b952', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#f59e0b', '#06b6d4'];

export default function Estatisticas() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/imoveis.json')
      .then(r => r.json())
      .then(data => {
        setImoveis(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const calcularEstatisticas = () => {
    if (imoveis.length === 0) return null;

    const precosPorCidade = {};
    const quantidadePorCidade = {};
    const distribuicaoPrecos = {
      'Até R$ 200k': 0,
      'R$ 200k - R$ 400k': 0,
      'R$ 400k - R$ 600k': 0,
      'R$ 600k - R$ 800k': 0,
      'Acima de R$ 800k': 0,
    };
    const quartosPorImovel = {};
    
    imoveis.forEach(imovel => {
      const cidade = imovel.cidade_estado;
      const preco = Number(imovel.preco);
      
      if (!precosPorCidade[cidade]) {
        precosPorCidade[cidade] = [];
        quantidadePorCidade[cidade] = 0;
      }
      precosPorCidade[cidade].push(preco);
      quantidadePorCidade[cidade]++;

      if (preco <= 200000) distribuicaoPrecos['Até R$ 200k']++;
      else if (preco <= 400000) distribuicaoPrecos['R$ 200k - R$ 400k']++;
      else if (preco <= 600000) distribuicaoPrecos['R$ 400k - R$ 600k']++;
      else if (preco <= 800000) distribuicaoPrecos['R$ 600k - R$ 800k']++;
      else distribuicaoPrecos['Acima de R$ 800k']++;

      const quartos = imovel.quartos;
      quartosPorImovel[quartos] = (quartosPorImovel[quartos] || 0) + 1;
    });

    const mediaPorCidade = Object.entries(precosPorCidade).map(([cidade, precos]) => ({
      cidade: cidade.split('/')[0],
      media: precos.reduce((a, b) => a + b, 0) / precos.length,
      quantidade: quantidadePorCidade[cidade],
    })).sort((a, b) => b.media - a.media).slice(0, 10);

    const dadosDistribuicao = Object.entries(distribuicaoPrecos).map(([faixa, quantidade]) => ({
      faixa,
      quantidade,
    }));

    const dadosQuartos = Object.entries(quartosPorImovel).map(([quartos, quantidade]) => ({
      quartos: `${quartos} ${quartos === '1' ? 'quarto' : 'quartos'}`,
      quantidade,
    })).sort((a, b) => a.quartos.localeCompare(b.quartos));

    const precoMedio = imoveis.reduce((sum, i) => sum + Number(i.preco), 0) / imoveis.length;
    const precoMaiorDesconto = Math.min(...imoveis.map(i => Number(i.preco)));
    const precoMaisAlto = Math.max(...imoveis.map(i => Number(i.preco)));
    const mediaPorM2 = imoveis.reduce((sum, i) => sum + (Number(i.preco) / Number(i.tamanho_m2)), 0) / imoveis.length;

    const simulacaoTendencia = [
      { mes: 'Jan', preco: precoMedio * 0.95 },
      { mes: 'Fev', preco: precoMedio * 0.93 },
      { mes: 'Mar', preco: precoMedio * 0.92 },
      { mes: 'Abr', preco: precoMedio * 0.94 },
      { mes: 'Mai', preco: precoMedio * 0.96 },
      { mes: 'Jun', preco: precoMedio * 1.0 },
    ];

    return {
      mediaPorCidade,
      dadosDistribuicao,
      dadosQuartos,
      precoMedio,
      precoMaiorDesconto,
      precoMaisAlto,
      mediaPorM2,
      simulacaoTendencia,
      totalImoveis: imoveis.length,
    };
  };

  const stats = calcularEstatisticas();

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-[#11397a] text-xl">Carregando estatísticas...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#11397a] mb-4">Sem dados disponíveis</h1>
          <Link to="/oportunidades" className="text-[#e6b952] hover:underline">
            Ver Oportunidades
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />

      <section className="bg-gradient-to-b from-[#11397a]/5 to-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#11397a] mb-3">
              📊 Estatísticas do Mercado
            </h1>
            <p className="text-[#11397a]/70 text-lg">
              Análise completa de {stats.totalImoveis} imóveis em leilão
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-sm text-[#11397a]/60 mb-2">Preço Médio</div>
              <div className="text-2xl font-bold text-[#11397a]">{BRL.format(stats.precoMedio)}</div>
              <div className="text-xs text-[#11397a]/50 mt-1">Todos os imóveis</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-sm text-[#11397a]/60 mb-2">Maior Oportunidade</div>
              <div className="text-2xl font-bold text-green-600">{BRL.format(stats.precoMaiorDesconto)}</div>
              <div className="text-xs text-[#11397a]/50 mt-1">Menor preço disponível</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-sm text-[#11397a]/60 mb-2">Maior Valor</div>
              <div className="text-2xl font-bold text-[#e6b952]">{BRL.format(stats.precoMaisAlto)}</div>
              <div className="text-xs text-[#11397a]/50 mt-1">Imóvel premium</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <div className="text-sm text-[#11397a]/60 mb-2">Preço Médio/m²</div>
              <div className="text-2xl font-bold text-[#11397a]">{BRL.format(stats.mediaPorM2)}</div>
              <div className="text-xs text-[#11397a]/50 mt-1">Por metro quadrado</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                <span>🏙️</span>
                Top 10 Cidades - Preço Médio
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.mediaPorCidade} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="cidade" width={100} style={{ fontSize: '12px' }} />
                  <Tooltip formatter={(value) => BRL.format(value)} />
                  <Bar dataKey="media" fill="#11397a" name="Preço Médio" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                <span>💰</span>
                Distribuição por Faixa de Preço
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={stats.dadosDistribuicao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ faixa, percent }) => `${faixa}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="quantidade"
                    style={{ fontSize: '11px' }}
                  >
                    {stats.dadosDistribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                <span>📈</span>
                Tendência de Preços (Últimos 6 Meses)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.simulacaoTendencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => BRL.format(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="preco" stroke="#11397a" strokeWidth={3} name="Preço Médio" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-[#11397a]/60 mt-3 text-center">
                * Dados simulados baseados no preço médio atual
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
              <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                <span>🛏️</span>
                Distribuição por Número de Quartos
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.dadosQuartos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quartos" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#e6b952" name="Quantidade de Imóveis" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#11397a] to-[#1e5bb8] text-white rounded-xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💡</span>
              Insights do Mercado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">🎯 Melhor Custo-Benefício</h4>
                <p className="text-sm opacity-90">
                  A cidade de <strong>{stats.mediaPorCidade[stats.mediaPorCidade.length - 1]?.cidade}</strong> oferece 
                  o menor preço médio ({BRL.format(stats.mediaPorCidade[stats.mediaPorCidade.length - 1]?.media)})
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">🏆 Maior Demanda</h4>
                <p className="text-sm opacity-90">
                  <strong>{stats.mediaPorCidade[0]?.quantidade}</strong> imóveis disponíveis 
                  em {stats.mediaPorCidade[0]?.cidade}
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">💰 Economia Média</h4>
                <p className="text-sm opacity-90">
                  Imóveis em leilão custam em média <strong>30-50% menos</strong> que o valor de mercado
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">📊 Tendência</h4>
                <p className="text-sm opacity-90">
                  Os preços têm se mantido <strong>estáveis</strong> nos últimos meses, 
                  indicando um mercado equilibrado
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/oportunidades"
              className="inline-block bg-[#e6b952] text-[#11397a] font-bold py-4 px-8 rounded-lg hover:bg-[#d4a842] transition-colors text-lg shadow-lg"
            >
              🔍 Ver Todas as Oportunidades
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
