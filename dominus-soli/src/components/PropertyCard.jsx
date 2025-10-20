import { BRL, formatDateBR } from "../utils/formatters";

export default function PropertyCard({ item }) {
  return (
    <div className="flex flex-col bg-white border border-[#11397a] rounded-2xl shadow-sm transition
                    hover:-translate-y-0.5 hover:shadow-2xl overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={/^(http|\/)/.test(item.foto) ? item.foto : `/data/${item.foto}`}
          alt={item.cidade_estado}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
      </div>
    </div>
  );
}
