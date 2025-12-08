/**
 * CommentsList.jsx - Lista de Comentários de Imóvel
 * 
 * Componente que exibe os comentários aprovados de um imóvel.
 * Mostra avaliação em estrelas, texto do comentário e informações
 * do autor.
 * 
 * Elementos exibidos por comentário:
 * - Avatar: Círculo colorido com iniciais do nome
 * - Nome do usuário
 * - Data formatada (ex: "Hoje", "3 dias atrás", "15 jan 2024")
 * - Rating em estrelas (1-5)
 * - Texto do comentário
 * 
 * Estados:
 * - Loading: Exibe mensagem "Carregando comentários..."
 * - Vazio: Convida usuário a ser o primeiro a comentar
 * - Com dados: Lista todos os comentários
 * 
 * Funções auxiliares:
 * - renderStars: Gera estrelas preenchidas/vazias
 * - formatarData: Converte ISO para texto relativo
 * - getInitials: Extrai iniciais do nome
 * - getAvatarColor: Gera cor consistente por nome
 * 
 * @param {Array} comments - Array de comentários aprovados
 * @param {boolean} loading - Estado de carregamento
 */

export default function CommentsList({ comments, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[#11397a] text-lg">Carregando comentários...</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-[#11397a]/70">Nenhum comentário ainda. Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    const agora = new Date();
    const diffMs = agora - data;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return 'Hoje';
    if (diffDias === 1) return 'Ontem';
    if (diffDias < 7) return `${diffDias} dias atrás`;
    if (diffDias < 30) return `${Math.floor(diffDias / 7)} semanas atrás`;
    
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white border-2 border-[#11397a]/10 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex gap-3 sm:gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${getAvatarColor(
                comment.userName
              )} flex items-center justify-center text-white font-bold text-sm sm:text-lg`}
            >
              {getInitials(comment.userName)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-[#11397a] text-sm sm:text-base">
                    {comment.userName}
                  </h4>
                  <p className="text-xs text-[#11397a]/60">
                    {formatarData(comment.data)}
                  </p>
                </div>
                {renderStars(comment.rating)}
              </div>

              <p className="text-[#11397a] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {comment.texto}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
