/**
 * AnalyticsContext.jsx - Contexto de Analytics e Rastreamento
 * 
 * Este contexto rastreia e armazena dados de interação dos usuários com a plataforma.
 * Os dados são usados para gerar estatísticas no painel administrativo.
 * 
 * Tipos de eventos rastreados:
 * 1. VISUALIZAÇÕES: Quantas vezes cada imóvel foi visualizado (registrarVisualizacao)
 * 2. FAVORITOS: Log de adições/remoções de favoritos (registrarFavorito)
 * 3. CONTATOS: Origem dos contatos recebidos (registrarContato)
 * 
 * Funcionalidades:
 * - registrarVisualizacao(imovelId): Incrementa contador de views do imóvel
 * - registrarFavorito(imovelId, acao): Loga ação de favorito ('adicionar'/'remover')
 * - registrarContato(origem): Registra origem do contato (ex: 'formulario_contato')
 * - limparAnalytics(): Remove todos os dados de analytics (com confirmação)
 * 
 * Os eventos de favorito e contato são capturados via CustomEvents do window,
 * permitindo que outros componentes disparem eventos sem dependência direta.
 * 
 * Persistência: Todos os dados são salvos no localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto de analytics
const AnalyticsContext = createContext();

/**
 * Hook para acessar o contexto de analytics
 * @returns {Object} { visualizacoes, favoritosLog, contatosLog, registrarVisualizacao, registrarFavorito, registrarContato, limparAnalytics }
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics deve ser usado dentro de AnalyticsProvider');
  }
  return context;
}

export function AnalyticsProvider({ children }) {
  const [visualizacoes, setVisualizacoes] = useState({});
  const [favoritosLog, setFavoritosLog] = useState([]);
  const [contatosLog, setContatosLog] = useState([]);

  useEffect(() => {
    try {
      const storedVisualizacoes = localStorage.getItem('analytics_visualizacoes');
      const storedFavoritos = localStorage.getItem('analytics_favoritos');
      const storedContatos = localStorage.getItem('analytics_contatos');
      
      if (storedVisualizacoes) setVisualizacoes(JSON.parse(storedVisualizacoes));
      if (storedFavoritos) setFavoritosLog(JSON.parse(storedFavoritos));
      if (storedContatos) setContatosLog(JSON.parse(storedContatos));
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('analytics_visualizacoes', JSON.stringify(visualizacoes));
  }, [visualizacoes]);

  useEffect(() => {
    localStorage.setItem('analytics_favoritos', JSON.stringify(favoritosLog));
  }, [favoritosLog]);

  useEffect(() => {
    localStorage.setItem('analytics_contatos', JSON.stringify(contatosLog));
  }, [contatosLog]);

  const registrarVisualizacao = (imovelId) => {
    setVisualizacoes(prev => ({
      ...prev,
      [imovelId]: {
        count: (prev[imovelId]?.count || 0) + 1,
        ultimaVisualizacao: new Date().toISOString(),
      }
    }));
  };

  const registrarFavorito = (imovelId, acao) => {
    setFavoritosLog(prev => [...prev, {
      imovelId,
      acao,
      timestamp: new Date().toISOString(),
    }]);
  };

  const registrarContato = (origem) => {
    setContatosLog(prev => [...prev, {
      origem,
      timestamp: new Date().toISOString(),
    }]);
  };

  const limparAnalytics = () => {
    if (window.confirm('Deseja realmente limpar todos os dados de analytics? Esta ação não pode ser desfeita.')) {
      setVisualizacoes({});
      setFavoritosLog([]);
      setContatosLog([]);
      localStorage.removeItem('analytics_visualizacoes');
      localStorage.removeItem('analytics_favoritos');
      localStorage.removeItem('analytics_contatos');
    }
  };

  useEffect(() => {
    const handleFavoritoEvent = (e) => {
      registrarFavorito(e.detail.imovelId, e.detail.acao);
    };

    const handleContatoEvent = (e) => {
      registrarContato(e.detail.origem);
    };

    window.addEventListener('analytics:favorito', handleFavoritoEvent);
    window.addEventListener('analytics:contato', handleContatoEvent);

    return () => {
      window.removeEventListener('analytics:favorito', handleFavoritoEvent);
      window.removeEventListener('analytics:contato', handleContatoEvent);
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={{
      visualizacoes,
      favoritosLog,
      contatosLog,
      registrarVisualizacao,
      registrarFavorito,
      registrarContato,
      limparAnalytics,
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
