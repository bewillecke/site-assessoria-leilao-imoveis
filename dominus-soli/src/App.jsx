import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritosProvider } from "./contexts/FavoritosContext";
import { CalculadoraProvider } from "./contexts/CalculadoraContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { CommentsProvider } from "./contexts/CommentsContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <div className="overflow-x-hidden w-full">
      <AuthProvider>
        <FavoritosProvider>
          <CalculadoraProvider>
            <AnalyticsProvider>
              <CommentsProvider>
                <BrowserRouter>
                  <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/oportunidades" element={<Oportunidades />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/simulacoes" element={<Simulacoes />} />
                <Route path="/estatisticas" element={<Estatisticas />} />
                <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
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