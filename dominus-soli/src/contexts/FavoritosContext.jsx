import { createContext, useContext, useState, useEffect } from 'react';

const FavoritosContext = createContext();

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  }
  return context;
}

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const savedFavoritos = localStorage.getItem('favoritos');
    if (savedFavoritos) {
      try {
        setFavoritos(JSON.parse(savedFavoritos));
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        setFavoritos([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (imovel) => {
    setFavoritos(prev => {
      const existe = prev.find(f => f.id === imovel.id);
      
      try {
        const event = new CustomEvent('analytics:favorito', {
          detail: { imovelId: imovel.id, acao: existe ? 'remover' : 'adicionar' }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Erro ao registrar analytics:', error);
      }
      
      if (existe) {
        return prev.filter(f => f.id !== imovel.id);
      }
      return [...prev, imovel];
    });
  };

  const isFavorito = (imovelId) => {
    return favoritos.some(f => f.id === imovelId);
  };

  const limparFavoritos = () => {
    setFavoritos([]);
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
