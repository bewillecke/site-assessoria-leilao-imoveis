import { Link } from "react-router-dom";
import { BRL, formatDateBR } from "../utils/formatters";
import { useFavoritos } from "../contexts/FavoritosContext";

export default function PropertyCard({ item }) {
  const { toggleFavorito, isFavorito } = useFavoritos();

  return (
    <div className="flex flex-col bg-white border border-[#11397a] rounded-2xl shadow-sm transition duration-600
          hover:-translate-y-0.5 hover:shadow-2xl overflow-hidden relative">
      
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorito(item);
        }}
        className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isFavorito(item.id)
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-400 hover:bg-red-100 hover:text-red-500'
        }`}
        title={isFavorito(item.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        ❤️
      </button>

      <Link to={`/imovel/${item.id}`} className="flex flex-col">
        <div className="aspect-square overflow-hidden">
          <img
            src={/^(http|\/)/.test(item.foto) ? item.foto : `/data/${item.foto}`}
            alt={item.cidade_estado}
            className="w-full h-full object-cover transition-transform duration-600 hover:scale-[1.03]"
          />
        </div>

      <div className="px-6 pt-4 pb-6">
        <h3 className="text-[#11397a] text-2xl font-extrabold text-center">
          {BRL.format(Number(item.preco))}
        </h3>

        <p className="text-[#11397a] font-medium mt-4">{item.cidade_estado}</p>
        <p className="text-[#11397a] mt-1">
          {item.quartos} quarto(s) · {item.banheiros} banheiro(s)
        </p>
        <p className="text-[#11397a] mt-1">{item.tamanho_m2} m²</p>
        <p className="text-[#11397a] mt-1">
          Data do leilão: {formatDateBR(item.data_leilao)}
        </p>
        
        <button className="mt-4 w-full bg-[#e6b952] text-[#11397a] font-bold py-2 rounded-lg hover:bg-[#d4a842] transition-colors">
          Ver Detalhes
        </button>
      </div>
      </Link>
    </div>
  );
}
