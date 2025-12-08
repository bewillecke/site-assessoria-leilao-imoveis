/**
 * CommentsContext.jsx - Contexto de Comentários e Avaliações
 * 
 * Este contexto gerencia o sistema de comentários e avaliações dos imóveis.
 * Implementa um fluxo de aprovação onde comentários passam por moderação.
 * 
 * Estados de um comentário:
 * - 'pending': Aguardando moderação (não visível publicamente)
 * - 'approved': Aprovado e visível para todos
 * - 'rejected': Rejeitado e não visível
 * 
 * Funcionalidades públicas:
 * - fetchCommentsByImovel(imovelId): Busca comentários aprovados de um imóvel
 * - addComment(imovelId, rating, texto): Adiciona novo comentário (requer login)
 * - getImovelRating(imovelId): Obtém média de avaliações do imóvel
 * 
 * Funcionalidades administrativas:
 * - fetchAllComments(status): Busca todos comentários, opcionalmente por status
 * - approveComment(id): Aprova um comentário pendente
 * - rejectComment(id): Rejeita um comentário
 * - deleteComment(id): Remove permanentemente um comentário
 * 
 * Todas as operações são sincronizadas com o servidor via API REST.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Criação do contexto de comentários
const CommentsContext = createContext();

/**
 * Hook para acessar o contexto de comentários
 * @returns {Object} { comments, loading, fetchCommentsByImovel, fetchAllComments, addComment, approveComment, rejectComment, deleteComment, getImovelRating }
 */
export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments deve ser usado dentro de CommentsProvider');
  }
  return context;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function CommentsProvider({ children }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCommentsByImovel = async (imovelId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/comments?imovelId=${imovelId}&status=approved`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async (status = null) => {
    setLoading(true);
    try {
      const url = status 
        ? `${API_BASE}/api/comments?status=${status}`
        : `${API_BASE}/api/comments`;
      const res = await fetch(url);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (imovelId, rating, texto) => {
    if (!user) {
      throw new Error('Você precisa estar logado para comentar');
    }

    try {
      const res = await fetch(`${API_BASE}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imovelId,
          userId: user.id,
          userName: user.name,
          rating,
          texto
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao adicionar comentário');
      }

      const newComment = await res.json();
      return { success: true, comment: newComment };
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      return { success: false, error: error.message };
    }
  };

  const approveComment = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}/approve`, {
        method: 'PATCH'
      });

      if (!res.ok) throw new Error('Erro ao aprovar comentário');

      const updated = await res.json();
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));
      return { success: true };
    } catch (error) {
      console.error('Erro ao aprovar comentário:', error);
      return { success: false, error: error.message };
    }
  };

  const rejectComment = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}/reject`, {
        method: 'PATCH'
      });

      if (!res.ok) throw new Error('Erro ao rejeitar comentário');

      const updated = await res.json();
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));
      return { success: true };
    } catch (error) {
      console.error('Erro ao rejeitar comentário:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Erro ao deletar comentário');

      setComments(prev => prev.filter(c => c.id !== commentId));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      return { success: false, error: error.message };
    }
  };

  const getImovelRating = async (imovelId) => {
    try {
      const res = await fetch(`${API_BASE}/api/imoveis/${imovelId}/rating`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar rating:', error);
      return { averageRating: 0, totalRatings: 0 };
    }
  };

  const value = {
    comments,
    loading,
    fetchCommentsByImovel,
    fetchAllComments,
    addComment,
    approveComment,
    rejectComment,
    deleteComment,
    getImovelRating
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
}
