import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function QuemSomos() {
  return (
    <>
      <Header />
      <Navbar />
      <section className="flex justify-center py-20 bg-white">
        <div className="flex flex-col md:flex-row gap-32 max-w-6xl w-full px-4">
          <div className="flex-1 flex flex-col items-center text-center gap-12">
            <img src="/data/imagens/soraya.jpeg" alt="Soraya Willecke" className="w-52 h-52 object-cover rounded-full mb-2 border-4 border-[#11397a]" />
            <h3 className="text-[#11397a] text-3xl font-bold mb-2">Soraya Willecke</h3>
            <p className="text-[#11397a] text-xl leading-relaxed">
              Servidora pública da Justiça Federal. Formada em Direito com especialização em Direito Imobiliário. Minha essência profissional é guiada por três pilares: confiança, para que o investidor sinta-se seguro em cada decisão; transparência, garantindo clareza sobre todos os riscos e vantagens; e resultado, transformando oportunidades de leilão em ativos reais e rentáveis.<br />
              Sou movida pelo desafio de simplificar um mercado que muitos consideram complexo e arriscado, tornando-o acessível, previsível e altamente promissor para quem busca multiplicar seu patrimônio com inteligência.
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center text-center gap-12">
            <img src="/data/imagens/ana.jpeg" alt="Ana Bek" className="w-52 h-52 object-cover rounded-full mb-2 border-4 border-[#11397a]" />
            <h3 className="text-[#11397a] text-3xl font-bold mb-2">Ana Bek</h3>
            <p className="text-[#11397a] text-xl leading-relaxed">
              Advogada especialista em Direito Imobiliário, com ampla experiência em inventários e regularização de imóveis. Minha atuação é guiada por três princípios que considero essenciais: segurança, para que cada cliente tenha tranquilidade em todas as etapas do processo; clareza, garantindo que cada decisão seja tomada de forma consciente e informada; e eficiência, buscando sempre resultados concretos e soluções que simplifiquem o complexo universo jurídico imobiliário.<br />
              Sou movida pela missão de transformar desafios em caminhos viáveis, trazendo segurança jurídica e valorização patrimonial a quem deseja regularizar, adquirir ou transmitir bens com confiança e tranquilidade.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
