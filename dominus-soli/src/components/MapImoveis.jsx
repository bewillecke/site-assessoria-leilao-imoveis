/**
 * MapImoveis.jsx - Mapa Interativo de Imóveis
 * 
 * Componente que exibe um mapa do Brasil com marcadores
 * indicando a localização de cada imóvel disponível.
 * 
 * Tecnologia: React-Leaflet com tiles do OpenStreetMap
 * 
 * Funcionalidades:
 * - Mapa centrálizado no Brasil (zoom 4)
 * - Marcadores azuis para cada imóvel
 * - Popup ao clicar: endereço, cidade e preço
 * - Zoom e pan interativos
 * 
 * @param {Array} imoveis - Array de imóveis com latitude e longitude
 * 
 * Nota: Requer que os imóveis tenham as propriedades:
 * latitude, longitude, endereco, cidade_estado, preco
 */

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BRL } from '../utils/formatters';

const MapImoveis = ({ imoveis }) => (
  <div className="flex justify-center my-12 px-4 relative z-0">
    <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg relative z-0">
      <MapContainer 
        center={[-15.7801, -47.9292]} 
        zoom={4} 
        style={{ height: '400px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {imoveis.map((imovel, idx) => (
          <Marker key={idx} position={[imovel.latitude, imovel.longitude]}>
            <Popup>
              <div className="text-sm">
                <strong className="text-[#11397a]">{imovel.endereco}</strong><br />
                <span className="text-[#11397a] font-semibold">{imovel.cidade_estado}</span><br />
                <span className="text-[#11397a] font-bold">{BRL.format(Number(imovel.preco))}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </div>
);

export default MapImoveis;