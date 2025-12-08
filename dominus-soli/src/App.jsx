/**
 * App.jsx - Componente Raiz da Aplicação
 * 
 * Este é o componente principal que orquestra toda a aplicação.
 * Responsabilidades:
 * 
 * 1. PROVIDERS (Contextos Globais):
 *    - AuthProvider: Gerencia autenticação de usuários (login/logout/registro)
 *    - FavoritosProvider: Gerencia lista de imóveis favoritos do usuário
 *    - CalculadoraProvider: Gerencia simulações de viabilidade de investimento
 *    - AnalyticsProvider: Rastreia interações do usuário (visualizações, favoritos, contatos)
 *    - CommentsProvider: Gerencia comentários e avaliações de imóveis
 * 
 * 2. ROTEAMENTO:
 *    - Define todas as rotas públicas e protegidas da aplicação
 *    - A rota /admin é protegida pelo componente ProtectedRoute
 * 
 * Estrutura: Providers envolvem o BrowserRouter que contém todas as rotas
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Provedores de contexto global - fornecem estado compartilhado para toda a aplicação
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritosProvider } from "./contexts/FavoritosContext";
import { CalculadoraProvider } from "./contexts/CalculadoraContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { CommentsProvider } from "./contexts/CommentsContext";

// Componente de proteção de rotas - requer autenticação
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas da aplicação
import Home from "./pages/Home.jsx";
import QuemSomos from "./pages/QuemSomos.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Favoritos from "./pages/Favoritos.jsx";
import Simulacoes from "./pages/Simulacoes.jsx";
import Estatisticas from "./pages/Estatisticas.jsx";
import Contato from "./pages/Contato.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import ImovelDetalhes from "./pages/ImovelDetalhes.jsx";

// Estilos do Leaflet para mapas interativos
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    // Container principal com overflow controlado para evitar scroll horizontal
    <div className="overflow-x-hidden w-full">
      {/* Hierarquia de Providers: cada um fornece seu contexto para toda a árvore abaixo */}
      <AuthProvider>
        <FavoritosProvider>
          <CalculadoraProvider>
            <AnalyticsProvider>
              <CommentsProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Rotas Públicas - acessíveis por qualquer visitante */}
                    <Route path="/" element={<Home />} />
                    <Route path="/quem-somos" element={<QuemSomos />} />
                    <Route path="/oportunidades" element={<Oportunidades />} />
                    <Route path="/favoritos" element={<Favoritos />} />
                    <Route path="/simulacoes" element={<Simulacoes />} />
                    <Route path="/estatisticas" element={<Estatisticas />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Rota Protegida - apenas usuários autenticados podem acessar */}
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } />
                    
                    {/* Rota dinâmica para detalhes de um imóvel específico */}
                    <Route path="/imovel/:id" element={<ImovelDetalhes />} />
                  </Routes>
                </BrowserRouter>
              </CommentsProvider>
            </AnalyticsProvider>
          </CalculadoraProvider>
        </FavoritosProvider>
      </AuthProvider>
    </div>
  );
}