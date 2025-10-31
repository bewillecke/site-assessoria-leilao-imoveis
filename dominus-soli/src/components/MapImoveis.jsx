import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BRL } from '../utils/formatters';

const MapImoveis = ({ imoveis }) => (
  <div className="flex justify-center my-12 px-4 relative z-0">
    <div className="w-full max-w-6xl rounded-2xl border-4 border-[#11397a] overflow-hidden shadow-lg relative z-0">
      <MapContainer 
        center={[-15.7801, -47.9292]} 
        zoom={4} 
        style={{ height: '300px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
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