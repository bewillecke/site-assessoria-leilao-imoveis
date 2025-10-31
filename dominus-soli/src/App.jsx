import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import QuemSomos from "./pages/QuemSomos.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Contato from "./pages/Contato.jsx";
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </BrowserRouter>
  );
}