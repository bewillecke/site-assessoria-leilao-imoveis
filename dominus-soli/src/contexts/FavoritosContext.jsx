/**
 * FavoritosContext.jsx - Contexto de Gerenciamento de Favoritos
 * 
 * Este contexto gerencia a lista de imóveis favoritos do usuário.
 * Suporta dois modos de operação:
 * 
 * 1. USUÁRIO LOGADO: Favoritos são sincronizados com o servidor via API
 * 2. VISITANTE (não logado): Favoritos são armazenados apenas no localStorage
 * 
 * Funcionalidades:
 * - toggleFavorito(imovel): Adiciona ou remove um imóvel dos favoritos
 * - isFavorito(id): Verifica se um imóvel está nos favoritos
 * - limparFavoritos(): Remove todos os favoritos
 * - totalFavoritos: Contador de itens na lista
 * 
 * Dispara eventos customizados para o sistema de analytics quando
 * favoritos são adicionados ou removidos.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Criação do contexto de favoritos
const FavoritosContext = createContext();

/**
 * Hook para acessar o contexto de favoritos
 * @returns {Object} { favoritos, toggleFavorito, isFavorito, limparFavoritos, totalFavoritos }
 */
export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  }
  return context;
}

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load from API
      Promise.all([
        fetch(`http://localhost:4000/api/users/${user.id}/favorites`).then(res => res.json()),
        fetch('http://localhost:4000/api/imoveis').then(res => res.json())
      ])
      .then(([favIds, imoveis]) => {
        if (Array.isArray(favIds) && Array.isArray(imoveis)) {
          const userFavs = imoveis.filter(im => favIds.includes(im.id));
          setFavoritos(userFavs);
        }
      })
      .catch(err => console.error('Erro ao carregar favoritos do servidor:', err));
    } else {
      const savedFavoritos = localStorage.getItem('favoritos');
      if (savedFavoritos) {
        try {
          setFavoritos(JSON.parse(savedFavoritos));
        } catch (err) {
          console.error('Erro ao carregar favoritos:', err);
          setFavoritos([]);
        }
      } else {
        setFavoritos([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
  }, [favoritos, user]);

  const toggleFavorito = async (imovel) => {
    const existe = favoritos.find(f => f.id === imovel.id);
    let newFavoritos;
    
    if (existe) {
      newFavoritos = favoritos.filter(f => f.id !== imovel.id);
    } else {
      newFavoritos = [...favoritos, imovel];
    }
    
    setFavoritos(newFavoritos);

    try {
      const event = new CustomEvent('analytics:favorito', {
        detail: { imovelId: imovel.id, acao: existe ? 'remover' : 'adicionar' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erro ao registrar analytics:', error);
    }

    if (user) {
      try {
        await fetch(`http://localhost:4000/api/users/${user.id}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imovelId: imovel.id })
        });
      } catch (err) {
        console.error('Erro ao salvar favorito no servidor', err);
      }
    }
  };

  const isFavorito = (imovelId) => {
    return favoritos.some(f => f.id === imovelId);
  };

  const limparFavoritos = () => {
    setFavoritos([]);
    if (!user) {
      localStorage.removeItem('favoritos');
    }
  };

  const value = {
    favoritos,
    toggleFavorito,
    isFavorito,
    limparFavoritos,
    totalFavoritos: favoritos.length
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
}
