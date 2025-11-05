import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function Admin() {
  const [imoveis, setImoveis] = useState([]);
  const [form, setForm] = useState({
    foto: '',
    cidade_estado: '',
    endereco: '',
    tamanho_m2: '',
    quartos: '',
    banheiros: '',
    preco: '',
    data_leilao: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/imoveis`)
      .then(r => r.json())
      .then(setImoveis)
      .catch(err => console.error(err));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        tamanho_m2: Number(form.tamanho_m2),
        quartos: Number(form.quartos),
        banheiros: Number(form.banheiros),
        preco: Number(form.preco),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude)
      };
      const res = await fetch(`${API_BASE}/api/imoveis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao salvar');
      }
      const saved = await res.json();
      setImoveis(prev => [...prev, saved]);
      setMessage('Imóvel cadastrado com sucesso!');
      setForm({ foto: '', cidade_estado: '', endereco: '', tamanho_m2: '', quartos: '', banheiros: '', preco: '', data_leilao: '', latitude: '', longitude: '' });
    } catch (err) {
      console.error(err);
      setMessage(String(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-[#11397a] mb-4">Painel Admin — Cadastrar novo imóvel</h1>
        {message && <div className="mb-4 text-sm text-[#11397a] font-semibold">{message}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input name="foto" value={form.foto} onChange={handleChange} placeholder="foto (caminho)" className="px-3 py-2 border rounded" />
          <input name="cidade_estado" value={form.cidade_estado} onChange={handleChange} placeholder="Cidade/UF" className="px-3 py-2 border rounded" />
          <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço" className="px-3 py-2 border rounded" />
          <div className="grid grid-cols-3 gap-2">
            <input name="tamanho_m2" value={form.tamanho_m2} onChange={handleChange} placeholder="m²" className="px-3 py-2 border rounded" />
            <input name="quartos" value={form.quartos} onChange={handleChange} placeholder="Quartos" className="px-3 py-2 border rounded" />
            <input name="banheiros" value={form.banheiros} onChange={handleChange} placeholder="Banheiros" className="px-3 py-2 border rounded" />
          </div>
          <input name="preco" value={form.preco} onChange={handleChange} placeholder="Preço (somente número)" className="px-3 py-2 border rounded" />
          <input name="data_leilao" value={form.data_leilao} onChange={handleChange} placeholder="Data do leilão (YYYY-MM-DD)" className="px-3 py-2 border rounded" />
          <div className="grid grid-cols-2 gap-2">
            <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="px-3 py-2 border rounded" />
            <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="px-3 py-2 border rounded" />
          </div>
          <button className="bg-[#11397a] text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Salvando...' : 'Salvar imóvel'}</button>
        </form>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#11397a] mb-4">Imóveis cadastrados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imoveis.map((im, idx) => (
              <div key={idx} className="border p-3 rounded">
                <div className="text-sm font-semibold text-[#11397a]">{im.cidade_estado} — {im.endereco}</div>
                <div className="text-sm">{im.tamanho_m2} m² • {im.quartos} quartos • R$ {im.preco}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
