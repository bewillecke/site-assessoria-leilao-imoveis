/**
 * CommentForm.jsx - Formulário de Comentários e Avaliações
 * 
 * Componente que permite usuários logados deixarem avaliações
 * e comentários sobre imóveis.
 * 
 * Campos:
 * - Rating: Sistema de 1-5 estrelas (clique para selecionar)
 * - Texto: Comentário descritivo (mínimo 10 caracteres)
 * 
 * Validações:
 * - Obrigatório selecionar rating
 * - Comentário deve ter pelo menos 10 caracteres
 * - Usuário deve estar logado
 * 
 * Comportamento:
 * - Visitante: Exibe links para login/cadastro
 * - Logado: Mostra formulário completo
 * - Sucesso: Limpa campos e exibe mensagem
 * - Erro: Exibe mensagem de erro
 * 
 * Os comentários enviados ficam em status 'pending' até
 * serem aprovados por um administrador.
 * 
 * @param {string} imovelId - ID do imóvel sendo comentado
 * @param {Function} onCommentAdded - Callback após adicionar comentário
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function CommentForm({ imovelId, onCommentAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (rating === 0) {
      setError('Por favor, selecione uma avaliação de 1 a 5 estrelas');
      return;
    }

    if (texto.trim().length < 10) {
      setError('O comentário deve ter pelo menos 10 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await onCommentAdded(imovelId, rating, texto);
      
      if (result.success) {
        setSuccess(true);
        setRating(0);
        setTexto('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error || 'Erro ao enviar comentário');
      }
    } catch (err) {
      setError('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-[#11397a] font-bold text-lg mb-2">
          Faça login para avaliar este imóvel
        </h3>
        <p className="text-[#11397a]/70 mb-4 text-sm">
          Você precisa estar logado para deixar comentários e avaliações
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/login"
            className="bg-[#11397a] text-white px-6 py-2 rounded-lg hover:bg-[#0e2f68] transition-colors font-semibold text-sm"
          >
            Fazer Login
          </Link>
          <Link
            to="/register"
            className="bg-[#e6b952] text-[#11397a] px-6 py-2 rounded-lg hover:bg-[#d4a842] transition-colors font-semibold text-sm"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-[#11397a]/20 rounded-xl p-4 sm:p-6">
      <h3 className="text-[#11397a] font-bold text-lg sm:text-xl mb-4">
        Deixe sua avaliação
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
          ✓ Comentário enviado com sucesso! Ele será exibido após aprovação do administrador.
        </div>
      )}

      <div className="mb-4">
        <label className="block text-[#11397a] font-semibold mb-2 text-sm sm:text-base">
          Sua avaliação *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl sm:text-4xl transition-transform hover:scale-110 focus:outline-none"
            >
              <span
                className={
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-[#11397a]/70 text-xs sm:text-sm mt-2">
            {rating === 1 && 'Muito ruim'}
            {rating === 2 && 'Ruim'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bom'}
            {rating === 5 && 'Excelente'}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-[#11397a] font-semibold mb-2 text-sm sm:text-base">
          Seu comentário *
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Compartilhe sua opinião sobre este imóvel, localização, condição, etc..."
          className="w-full px-4 py-3 border-2 border-[#11397a]/20 rounded-lg focus:border-[#11397a] focus:outline-none text-[#11397a] resize-none text-sm sm:text-base"
          rows={4}
          maxLength={500}
        />
        <p className="text-[#11397a]/60 text-xs mt-1">
          {texto.length}/500 caracteres
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#11397a] text-white font-bold py-3 rounded-lg hover:bg-[#0e2f68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? 'Enviando...' : '📝 Enviar Avaliação'}
      </button>

      <p className="text-[#11397a]/60 text-xs mt-3 text-center">
        Seu comentário será revisado antes de ser publicado
      </p>
    </form>
  );
}
