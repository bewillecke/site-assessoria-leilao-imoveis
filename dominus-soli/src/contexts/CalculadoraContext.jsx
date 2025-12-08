/**
 * CalculadoraContext.jsx - Contexto de Simulações de Investimento
 * 
 * Este contexto gerencia as simulações de viabilidade financeira realizadas
 * pelo usuário na calculadora de investimento imobiliário.
 * 
 * Funcionalidades:
 * - salvarSimulacao(simulacao): Salva uma nova simulação (máximo 10)
 * - removerSimulacao(id): Remove uma simulação específica
 * - limparSimulacoes(): Remove todas as simulações salvas
 * 
 * As simulações incluem:
 * - Valor do imóvel, custos (ITBI, registro, reforma, etc.)
 * - Valor estimado de revenda e tempo até revenda
 * - Cálculo de ROI, lucro e margem
 * 
 * Persistência: Todas as simulações são salvas no localStorage
 * para manter o histórico entre sessões.
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto da calculadora
const CalculadoraContext = createContext();

/**
 * Hook para acessar o contexto de simulações
 * @returns {Object} { simulacoes, salvarSimulacao, removerSimulacao, limparSimulacoes }
 */
export function useCalculadora() {
  const context = useContext(CalculadoraContext);
  if (!context) {
    throw new Error('useCalculadora deve ser usado dentro de CalculadoraProvider');
  }
  return context;
}

export function CalculadoraProvider({ children }) {
  const [simulacoes, setSimulacoes] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('simulacoes');
      if (stored) {
        setSimulacoes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar simulações:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('simulacoes', JSON.stringify(simulacoes));
  }, [simulacoes]);

  const salvarSimulacao = (simulacao) => {
    const novaSimulacao = {
      ...simulacao,
      id: Date.now(),
      data: new Date().toISOString(),
    };
    setSimulacoes(prev => [novaSimulacao, ...prev].slice(0, 10));
  };

  const removerSimulacao = (id) => {
    setSimulacoes(prev => prev.filter(sim => sim.id !== id));
  };

  const limparSimulacoes = () => {
    setSimulacoes([]);
  };

  return (
    <CalculadoraContext.Provider value={{
      simulacoes,
      salvarSimulacao,
      removerSimulacao,
      limparSimulacoes,
    }}>
      {children}
    </CalculadoraContext.Provider>
  );
}
