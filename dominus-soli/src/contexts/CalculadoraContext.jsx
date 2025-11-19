import { createContext, useContext, useState, useEffect } from 'react';

const CalculadoraContext = createContext();

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
