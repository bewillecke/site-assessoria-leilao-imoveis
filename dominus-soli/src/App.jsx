import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home.jsx";
import QuemSomos from "./pages/QuemSomos.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Contato from "./pages/Contato.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import ImovelDetalhes from "./pages/ImovelDetalhes.jsx";
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <div className="overflow-x-hidden w-full">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/imovel/:id" element={<ImovelDetalhes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}