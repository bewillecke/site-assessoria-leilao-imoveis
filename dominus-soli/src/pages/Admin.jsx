import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function Admin() {
  const { user, logout } = useAuth();
  const [imoveis, setImoveis] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [activeTab, setActiveTab] = useState('imoveis'); // 'imoveis' ou 'mensagens'
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

    fetch(`${API_BASE}/api/mensagens`)
      .then(r => r.json())
      .then(setMensagens)
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

  async function marcarComoLida(id) {
    try {
      await fetch(`${API_BASE}/api/mensagens/${id}/lida`, {
        method: 'PATCH'
      });
      setMensagens(prev => prev.map(m => 
        m.id === id ? { ...m, lida: true } : m
      ));
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
    }
  }

  const mensagensNaoLidas = mensagens.filter(m => !m.lida).length;

  return (
    <>
      <Header />
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#11397a]">
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[#11397a]">Bem-vindo, <strong>{user?.username}</strong></span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#11397a]/20 mb-6">
          <button
            onClick={() => setActiveTab('imoveis')}
            className={`px-6 py-3 font-bold transition-colors ${
              activeTab === 'imoveis'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            Imóveis
          </button>
          <button
            onClick={() => setActiveTab('mensagens')}
            className={`px-6 py-3 font-bold transition-colors relative ${
              activeTab === 'mensagens'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            Mensagens de Contato
            {mensagensNaoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {mensagensNaoLidas}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'imoveis' && (
          <>
            <h2 className="text-xl font-bold text-[#11397a] mb-4">Cadastrar novo imóvel</h2>
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
          </>
        )}

        {activeTab === 'mensagens' && (
          <div>
            <h2 className="text-xl font-bold text-[#11397a] mb-4">
              Mensagens de Contato ({mensagens.length})
            </h2>
            {mensagens.length === 0 ? (
              <p className="text-[#11397a]/60 text-center py-8">Nenhuma mensagem recebida ainda.</p>
            ) : (
              <div className="space-y-4">
                {mensagens.sort((a, b) => new Date(b.data) - new Date(a.data)).map((msg) => (
                  <div
                    key={msg.id}
                    className={`border-2 rounded-lg p-4 ${
                      msg.lida 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-[#e6b952] bg-[#fffef8]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-[#11397a] text-lg">{msg.nome}</h3>
                        <p className="text-sm text-[#11397a]/70">{msg.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#11397a]/60">
                          {new Date(msg.data).toLocaleString('pt-BR')}
                        </p>
                        {!msg.lida && (
                          <button
                            onClick={() => marcarComoLida(msg.id)}
                            className="mt-2 text-xs bg-[#11397a] text-white px-3 py-1 rounded hover:bg-[#0e2f68] transition-colors"
                          >
                            Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-[#11397a]/20">
                      <p className="text-[#11397a] whitespace-pre-wrap">{msg.mensagem}</p>
                    </div>
                    {msg.lida && (
                      <p className="text-xs text-green-600 mt-2">✓ Lida</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
