import { useEffect, useState } from "react";
import { shufflePick } from "../utils/formatters";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Carousel from "../components/Carousel.jsx";
import About from "../components/About.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    fetch("/imoveis.json")
      .then(r => r.json())
      .then(data => setImoveis(shufflePick(data, 8)))
      .catch(console.error);
  }, []);

  return (
    <>
      <Header />
      <Navbar />

      <section className="mt-4">
        <h2 className="text-[#11397a] text-[2rem] font-extrabold ml-8 mb-4">
          Imóveis em Destaque
        </h2>
        <Carousel items={imoveis} />
      </section>

      <About />
      <Footer />
    </>
  );
}
