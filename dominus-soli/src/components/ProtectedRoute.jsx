/**
 * ProtectedRoute.jsx - Componente de Proteção de Rotas
 * 
 * Este componente atua como um guard de rotas, protegendo páginas
 * que requerem autenticação (como o painel administrativo).
 * 
 * Comportamento:
 * 1. Enquanto verifica autenticação: Exibe loading spinner
 * 2. Usuário não autenticado: Redireciona para /login
 * 3. Usuário autenticado: Renderiza os componentes filhos
 * 
 * Uso: Envolva qualquer rota que precise de autenticação:
 * <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#11397a] text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
