import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useComments } from '../contexts/CommentsContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BRL } from '../utils/formatters';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
const COLORS = ['#11397a', '#e6b952', '#2563eb', '#dc2626', '#16a34a', '#9333ea'];

export default function Admin() {
  const { user, logout } = useAuth();
  const { visualizacoes, favoritosLog, contatosLog, limparAnalytics } = useAnalytics();
  const { comments, fetchAllComments, approveComment, rejectComment, deleteComment } = useComments();
  const [imoveis, setImoveis] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filtroMensagens, setFiltroMensagens] = useState('todas');
  const [respostaTexto, setRespostaTexto] = useState({});
  const [mostrarResposta, setMostrarResposta] = useState({});

  useEffect(() => {
    carregarDados();
    fetchAllComments('pending');
  }, []);

  async function carregarDados() {
    try {
      const [imoveisRes, mensagensRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/imoveis`),
        fetch(`${API_BASE}/api/mensagens`),
        fetch(`${API_BASE}/api/stats`)
      ]);
      setImoveis(await imoveisRes.json());
      setMensagens(await mensagensRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function iniciarEdicao(imovel) {
    setEditingId(imovel.id);
    setForm({
      foto: imovel.foto,
      cidade_estado: imovel.cidade_estado,
      endereco: imovel.endereco,
      tamanho_m2: imovel.tamanho_m2,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      preco: imovel.preco,
      data_leilao: imovel.data_leilao,
      latitude: imovel.latitude,
      longitude: imovel.longitude
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setEditingId(null);
    setForm({
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

      if (editingId) {
        const res = await fetch(`${API_BASE}/api/imoveis/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Erro ao atualizar');
        const updated = await res.json();
        setImoveis(prev => prev.map(im => im.id === editingId ? updated : im));
        setMessage('Imóvel atualizado com sucesso!');
        cancelarEdicao();
      } else {
        const res = await fetch(`${API_BASE}/api/imoveis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Erro ao salvar');
        const saved = await res.json();
        setImoveis(prev => [...prev, saved]);
        setMessage('Imóvel cadastrado com sucesso!');
        setForm({
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
      }
    } catch (err) {
      console.error(err);
      setMessage(String(err.message));
    } finally {
      setLoading(false);
    }
  }

  async function deletarImovel(id) {
    if (!confirm('Tem certeza que deseja deletar este imóvel?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/imoveis/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      setImoveis(prev => prev.filter(im => im.id !== id));
      setMessage('Imóvel deletado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar imóvel');
    }
  }

  async function marcarComoLida(id) {
    try {
      await fetch(`${API_BASE}/api/mensagens/${id}/lida`, { method: 'PATCH' });
      setMensagens(prev => prev.map(m => m.id === id ? { ...m, lida: true } : m));
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
    }
  }

  async function responderMensagem(id) {
    const resposta = respostaTexto[id];
    if (!resposta || !resposta.trim()) {
      alert('Digite uma resposta');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/mensagens/${id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resposta })
      });
      if (!res.ok) throw new Error('Erro ao responder');
      const updated = await res.json();
      setMensagens(prev => prev.map(m => m.id === id ? updated : m));
      setRespostaTexto(prev => ({ ...prev, [id]: '' }));
      setMostrarResposta(prev => ({ ...prev, [id]: false }));
      
      if (updated.emailStatus) {
        alert(updated.emailStatus);
      } else {
        alert('Resposta enviada com sucesso!');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar resposta');
    }
  }

  async function deletarMensagem(id) {
    if (!confirm('Tem certeza que deseja deletar esta mensagem?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/mensagens/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      setMensagens(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar mensagem');
    }
  }

  function exportarMensagensCSV() {
    const headers = ['ID', 'Nome', 'Email', 'Mensagem', 'Data', 'Lida', 'Resposta', 'Data Resposta'];
    const rows = mensagens.map(m => [
      m.id,
      m.nome,
      m.email,
      `"${m.mensagem.replace(/"/g, '""')}"`,
      new Date(m.data).toLocaleString('pt-BR'),
      m.lida ? 'Sim' : 'Não',
      m.resposta ? `"${m.resposta.replace(/"/g, '""')}"` : '',
      m.dataResposta ? new Date(m.dataResposta).toLocaleString('pt-BR') : ''
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mensagens_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  const mensagensNaoLidas = mensagens.filter(m => !m.lida).length;
  const mensagensFiltradas = mensagens.filter(m => {
    if (filtroMensagens === 'lidas') return m.lida;
    if (filtroMensagens === 'nao-lidas') return !m.lida;
    return true;
  });

  const totalImoveis = imoveis.length;
  const totalMensagens = mensagens.length;
  const mensagensRespondidas = mensagens.filter(m => m.resposta).length;
  
  const imoveisPorCidade = imoveis.reduce((acc, im) => {
    acc[im.cidade_estado] = (acc[im.cidade_estado] || 0) + 1;
    return acc;
  }, {});

  const mensagensPorMes = mensagens.reduce((acc, m) => {
    const mes = new Date(m.data).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Header />
      <Navbar />
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#11397a]">
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-[#11397a] text-sm sm:text-base">Bem-vindo, <strong>{user?.username}</strong></span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-bold"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-[#11397a]/20 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 sm:px-6 py-3 font-bold transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'dashboard'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('imoveis')}
            className={`px-4 sm:px-6 py-3 font-bold transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'imoveis'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            🏠 Imóveis ({totalImoveis})
          </button>
          <button
            onClick={() => setActiveTab('mensagens')}
            className={`px-4 sm:px-6 py-3 font-bold transition-colors whitespace-nowrap relative text-sm sm:text-base ${
              activeTab === 'mensagens'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            💬 Mensagens ({totalMensagens})
            {mensagensNaoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {mensagensNaoLidas}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 sm:px-6 py-3 font-bold transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'analytics'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => {
              setActiveTab('comentarios');
              fetchAllComments('pending');
            }}
            className={`px-4 sm:px-6 py-3 font-bold transition-colors whitespace-nowrap relative text-sm sm:text-base ${
              activeTab === 'comentarios'
                ? 'text-[#11397a] border-b-2 border-[#11397a]'
                : 'text-[#11397a]/50 hover:text-[#11397a]'
            }`}
          >
            💬 Comentários ({comments.length})
            {comments.filter(c => c.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comments.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#11397a]">Estatísticas Gerais</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-[#11397a] to-[#0e2f68] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                <div className="text-2xl sm:text-4xl mb-2">🏠</div>
                <div className="text-xl sm:text-3xl font-bold mb-1">{totalImoveis}</div>
                <div className="text-white/80 text-xs sm:text-base">Imóveis Cadastrados</div>
              </div>

              <div className="bg-gradient-to-br from-[#e6b952] to-[#d4a842] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-[#11397a] shadow-lg">
                <div className="text-2xl sm:text-4xl mb-2">💬</div>
                <div className="text-xl sm:text-3xl font-bold mb-1">{totalMensagens}</div>
                <div className="text-[#11397a]/80 text-xs sm:text-base">Mensagens Recebidas</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                <div className="text-2xl sm:text-4xl mb-2">✅</div>
                <div className="text-xl sm:text-3xl font-bold mb-1">{mensagensRespondidas}</div>
                <div className="text-white/80">Mensagens Respondidas</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-4xl mb-2">🔔</div>
                <div className="text-3xl font-bold mb-1">{mensagensNaoLidas}</div>
                <div className="text-white/80">Não Lidas</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                <div className="text-2xl sm:text-4xl mb-2">👥</div>
                <div className="text-xl sm:text-3xl font-bold mb-1">{stats?.totalUsers || 0}</div>
                <div className="text-white/80 text-xs sm:text-base">Usuários Cadastrados</div>
              </div>
            </div>

            {stats?.topFavorites?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border-2 border-[#11397a]/10 shadow-md">
                <h3 className="text-xl font-bold text-[#11397a] mb-4">❤️ Imóveis Mais Favoritados</h3>
                <div className="space-y-3">
                  {stats.topFavorites.map((im) => (
                    <div key={im.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#11397a] font-semibold">{im.endereco} - {im.cidade_estado}</span>
                        <span className="text-[#11397a]/70">{im.count} favoritos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(im.count / (stats.totalUsers || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-[#11397a]/10 shadow-md">
                <h3 className="text-xl font-bold text-[#11397a] mb-4">📍 Imóveis por Cidade</h3>
                <div className="space-y-3">
                  {Object.entries(imoveisPorCidade).slice(0, 8).map(([cidade, count]) => (
                    <div key={cidade}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#11397a] font-semibold">{cidade}</span>
                        <span className="text-[#11397a]/70">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#11397a] h-2 rounded-full"
                          style={{ width: `${(count / totalImoveis) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-[#11397a]/10 shadow-md">
                <h3 className="text-xl font-bold text-[#11397a] mb-4">📅 Mensagens por Mês</h3>
                <div className="space-y-3">
                  {Object.entries(mensagensPorMes).slice(-6).map(([mes, count]) => (
                    <div key={mes}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#11397a] font-semibold capitalize">{mes}</span>
                        <span className="text-[#11397a]/70">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#e6b952] h-2 rounded-full"
                          style={{ width: `${(count / totalMensagens) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'imoveis' && (
          <>
            <h2 className="text-xl font-bold text-[#11397a] mb-4">
              {editingId ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
            </h2>
            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded-lg border-2 border-[#11397a]/10">
              <input name="foto" value={form.foto} onChange={handleChange} placeholder="Caminho da foto (ex: imagens/imoveis/foto.jpg)" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              <input name="cidade_estado" value={form.cidade_estado} onChange={handleChange} placeholder="Cidade/UF (ex: São Paulo/SP)" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço completo" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" name="tamanho_m2" value={form.tamanho_m2} onChange={handleChange} placeholder="m²" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
                <input type="number" name="quartos" value={form.quartos} onChange={handleChange} placeholder="Quartos" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
                <input type="number" name="banheiros" value={form.banheiros} onChange={handleChange} placeholder="Banheiros" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              </div>
              <input type="number" name="preco" value={form.preco} onChange={handleChange} placeholder="Preço (somente números)" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              <input type="date" name="data_leilao" value={form.data_leilao} onChange={handleChange} className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude (ex: -23.5505)" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
                <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude (ex: -46.6333)" className="px-3 py-2 border rounded focus:outline-none focus:border-[#11397a]" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#11397a] text-white px-4 py-3 rounded-lg font-bold hover:bg-[#0e2f68] transition-colors" disabled={loading}>
                  {loading ? 'Salvando...' : editingId ? '💾 Atualizar Imóvel' : '➕ Cadastrar Imóvel'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelarEdicao} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <section className="mt-8">
              <h2 className="text-xl font-bold text-[#11397a] mb-4">Imóveis Cadastrados ({totalImoveis})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imoveis.map((im) => (
                  <div key={im.id} className="border-2 border-[#11397a]/20 p-4 rounded-lg bg-white hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">
                      <img src={`/data/${im.foto}`} alt={im.cidade_estado} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Imagem'} />
                    </div>
                    <div className="text-sm font-semibold text-[#11397a]">{im.cidade_estado}</div>
                    <div className="text-xs text-[#11397a]/70 mb-2">{im.endereco}</div>
                    <div className="text-sm text-[#11397a]">{im.tamanho_m2} m² • {im.quartos} quartos • {im.banheiros} banheiros</div>
                    <div className="text-lg font-bold text-[#11397a] mt-2">R$ {im.preco?.toLocaleString('pt-BR')}</div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => iniciarEdicao(im)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-blue-700 transition-colors">
                        ✏️ Editar
                      </button>
                      <button onClick={() => deletarImovel(im.id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors">
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'mensagens' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#11397a]">
                Mensagens de Contato ({mensagensFiltradas.length})
              </h2>
              <div className="flex gap-3">
                <select
                  value={filtroMensagens}
                  onChange={(e) => setFiltroMensagens(e.target.value)}
                  className="px-4 py-2 border-2 border-[#11397a]/20 rounded-lg font-semibold text-[#11397a] focus:outline-none focus:border-[#11397a]"
                >
                  <option value="todas">Todas</option>
                  <option value="nao-lidas">Não Lidas ({mensagensNaoLidas})</option>
                  <option value="lidas">Lidas ({totalMensagens - mensagensNaoLidas})</option>
                </select>
                <button
                  onClick={exportarMensagensCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  📥 Exportar CSV
                </button>
              </div>
            </div>

            {mensagensFiltradas.length === 0 ? (
              <p className="text-[#11397a]/60 text-center py-8">Nenhuma mensagem para exibir.</p>
            ) : (
              <div className="space-y-4">
                {mensagensFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data)).map((msg) => (
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
                      <div className="text-right flex flex-col gap-2">
                        <p className="text-xs text-[#11397a]/60">
                          {new Date(msg.data).toLocaleString('pt-BR')}
                        </p>
                        {!msg.lida && (
                          <button
                            onClick={() => marcarComoLida(msg.id)}
                            className="text-xs bg-[#11397a] text-white px-3 py-1 rounded hover:bg-[#0e2f68] transition-colors"
                          >
                            Marcar como lida
                          </button>
                        )}
                        <button
                          onClick={() => deletarMensagem(msg.id)}
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded border border-[#11397a]/20 mb-3">
                      <p className="text-[#11397a] whitespace-pre-wrap">{msg.mensagem}</p>
                    </div>

                    {msg.resposta ? (
                      <div className="bg-green-50 border border-green-200 p-3 rounded">
                        <div className="text-xs text-green-700 font-bold mb-1">
                          ✅ Respondida em {new Date(msg.dataResposta).toLocaleString('pt-BR')}
                        </div>
                        <p className="text-green-900 whitespace-pre-wrap">{msg.resposta}</p>
                      </div>
                    ) : (
                      <div>
                        {!mostrarResposta[msg.id] ? (
                          <button
                            onClick={() => setMostrarResposta(prev => ({ ...prev, [msg.id]: true }))}
                            className="bg-[#e6b952] text-[#11397a] px-4 py-2 rounded font-bold hover:bg-[#d4a842] transition-colors text-sm"
                          >
                            ✉️ Responder
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={respostaTexto[msg.id] || ''}
                              onChange={(e) => setRespostaTexto(prev => ({ ...prev, [msg.id]: e.target.value }))}
                              placeholder="Digite sua resposta..."
                              className="w-full px-3 py-2 border-2 border-[#11397a]/20 rounded-lg focus:outline-none focus:border-[#11397a]"
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => responderMensagem(msg.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition-colors text-sm"
                              >
                                📤 Enviar Resposta
                              </button>
                              <button
                                onClick={() => setMostrarResposta(prev => ({ ...prev, [msg.id]: false }))}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-400 transition-colors text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.lida && !msg.resposta && (
                      <p className="text-xs text-green-600 mt-2">✓ Lida</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#11397a]">Analytics e Métricas</h2>
              <button
                onClick={limparAnalytics}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
              >
                🗑️ Limpar Dados
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-2">Total de Visualizações</div>
                <div className="text-3xl font-bold">
                  {Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0)}
                </div>
                <div className="text-xs opacity-75 mt-2">Todos os imóveis</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-2">Total de Favoritos</div>
                <div className="text-3xl font-bold">{favoritosLog.length}</div>
                <div className="text-xs opacity-75 mt-2">Ações de favoritar</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-2">Total de Contatos</div>
                <div className="text-3xl font-bold">{contatosLog.length}</div>
                <div className="text-xs opacity-75 mt-2">Formulários enviados</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-2">Taxa de Conversão</div>
                <div className="text-3xl font-bold">
                  {Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0) > 0
                    ? ((favoritosLog.length / Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0)) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-xs opacity-75 mt-2">Visualizações → Favoritos</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
                <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                  <span>👀</span>
                  Top 10 Imóveis Mais Visualizados
                </h3>
                {Object.keys(visualizacoes).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-[#11397a]/60">Nenhum imóvel visualizado ainda</p>
                    <p className="text-sm text-[#11397a]/40 mt-2">Os dados aparecerão assim que os usuários começarem a navegar pelo site</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(visualizacoes)
                      .sort(([, a], [, b]) => b.count - a.count)
                      .slice(0, 10)
                      .map(([imovelId, data], index) => {
                        const imovel = imoveis.find(i => i.id === Number(imovelId));
                        return (
                          <div key={imovelId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#11397a] text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-semibold text-[#11397a] text-sm">
                                  {imovel?.endereco || `Imóvel #${imovelId}`}
                                </div>
                                <div className="text-xs text-[#11397a]/60">
                                  {imovel?.cidade_estado}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#11397a]">{data.count}</div>
                              <div className="text-xs text-[#11397a]/60">visualizações</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
                <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                  <span>❤️</span>
                  Favoritos por Imóvel
                </h3>
                {favoritosLog.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">❤️</div>
                    <p className="text-[#11397a]/60">Nenhum favorito registrado ainda</p>
                    <p className="text-sm text-[#11397a]/40 mt-2">Os dados aparecerão quando os usuários favoritarem imóveis</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={(() => {
                      const favoritosPorImovel = {};
                      favoritosLog.forEach(log => {
                        if (log.acao === 'adicionar') {
                          favoritosPorImovel[log.imovelId] = (favoritosPorImovel[log.imovelId] || 0) + 1;
                        }
                      });
                      const dados = Object.entries(favoritosPorImovel)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 10)
                        .map(([id, count]) => {
                          const imovel = imoveis.find(i => i.id === Number(id));
                          return {
                            nome: imovel?.cidade_estado?.split('/')[0] || `#${id}`,
                            quantidade: count,
                          };
                        });
                      return dados.length > 0 ? dados : [{ nome: 'Sem dados', quantidade: 0 }];
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} style={{ fontSize: '11px' }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#16a34a" name="Favoritos" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
                <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                  <span>📅</span>
                  Atividade ao Longo do Tempo (Últimos 7 Dias)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={(() => {
                    const hoje = new Date();
                    const ultimos7Dias = [];
                    for (let i = 6; i >= 0; i--) {
                      const data = new Date(hoje);
                      data.setDate(data.getDate() - i);
                      const dataStr = data.toISOString().split('T')[0];
                      
                      const visualizacoesDia = Object.values(visualizacoes).filter(v => 
                        v.ultimaVisualizacao && v.ultimaVisualizacao.startsWith(dataStr)
                      ).length;
                      
                      const favoritosDia = favoritosLog.filter(f => 
                        f.timestamp && f.timestamp.startsWith(dataStr)
                      ).length;
                      
                      const contatosDia = contatosLog.filter(c => 
                        c.timestamp && c.timestamp.startsWith(dataStr)
                      ).length;
                      
                      ultimos7Dias.push({
                        dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                        Visualizações: visualizacoesDia,
                        Favoritos: favoritosDia,
                        Contatos: contatosDia,
                      });
                    }
                    return ultimos7Dias;
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" style={{ fontSize: '12px' }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Visualizações" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Favoritos" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Contatos" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#11397a]/10">
                <h3 className="text-xl font-bold text-[#11397a] mb-4 flex items-center gap-2">
                  <span>🎯</span>
                  Funil de Conversão
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    {
                      etapa: 'Visualizações',
                      quantidade: Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0),
                    },
                    {
                      etapa: 'Favoritos',
                      quantidade: favoritosLog.filter(f => f.acao === 'adicionar').length,
                    },
                    {
                      etapa: 'Contatos',
                      quantidade: contatosLog.length,
                    },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="etapa" style={{ fontSize: '12px' }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#11397a" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-[#11397a]/80 space-y-1">
                    <div>• Taxa Visualização → Favorito: <strong>
                      {Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0) > 0
                        ? ((favoritosLog.filter(f => f.acao === 'adicionar').length / Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0)) * 100).toFixed(1)
                        : 0}%
                    </strong></div>
                    <div>• Taxa Favorito → Contato: <strong>
                      {favoritosLog.filter(f => f.acao === 'adicionar').length > 0
                        ? ((contatosLog.length / favoritosLog.filter(f => f.acao === 'adicionar').length) * 100).toFixed(1)
                        : 0}%
                    </strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#11397a] to-[#1e5bb8] text-white rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">📊 Insights e Recomendações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="font-bold mb-2">🏆 Imóvel Mais Popular</div>
                  <div className="opacity-90">
                    {(() => {
                      const maisVisto = Object.entries(visualizacoes).sort(([, a], [, b]) => b.count - a.count)[0];
                      if (!maisVisto) return 'Sem dados ainda';
                      const imovel = imoveis.find(i => i.id === Number(maisVisto[0]));
                      return imovel ? `${imovel.endereco} (${maisVisto[1].count} visualizações)` : `Imóvel #${maisVisto[0]}`;
                    })()}
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="font-bold mb-2">💡 Sugestão</div>
                  <div className="opacity-90">
                    {(() => {
                      const taxa = Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0) > 0
                        ? ((favoritosLog.length / Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0)) * 100)
                        : 0;
                      if (taxa < 5) return 'Taxa de conversão baixa. Considere melhorar fotos e descrições.';
                      if (taxa < 15) return 'Taxa de conversão moderada. Continue promovendo os imóveis.';
                      return 'Excelente taxa de conversão! Continue com o bom trabalho.';
                    })()}
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="font-bold mb-2">📈 Crescimento</div>
                  <div className="opacity-90">
                    {Object.values(visualizacoes).reduce((sum, v) => sum + v.count, 0)} visualizações totais • 
                    {' '}{favoritosLog.length} favoritos • 
                    {' '}{contatosLog.length} contatos
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="font-bold mb-2">🎯 Próximos Passos</div>
                  <div className="opacity-90">
                    Monitore os imóveis com alta visualização mas baixo favorit amento para ajustar estratégia.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comentarios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#11397a]">Moderação de Comentários</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchAllComments('pending')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                >
                  Pendentes ({comments.filter(c => c.status === 'pending').length})
                </button>
                <button
                  onClick={() => fetchAllComments('approved')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                >
                  Aprovados ({comments.filter(c => c.status === 'approved').length})
                </button>
                <button
                  onClick={() => fetchAllComments('rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                >
                  Rejeitados ({comments.filter(c => c.status === 'rejected').length})
                </button>
                <button
                  onClick={() => fetchAllComments()}
                  className="bg-[#11397a] text-white px-4 py-2 rounded-lg hover:bg-[#0e2f68] transition-colors text-sm font-semibold"
                >
                  Todos
                </button>
              </div>
            </div>

            {comments.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-[#11397a]/70">Nenhum comentário para moderar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const imovel = imoveis.find(i => i.id === comment.imovelId);
                  return (
                    <div
                      key={comment.id}
                      className={`border-2 rounded-xl p-6 ${
                        comment.status === 'pending' 
                          ? 'bg-orange-50 border-orange-200' 
                          : comment.status === 'approved'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-[#11397a] text-lg">{comment.userName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              comment.status === 'pending'
                                ? 'bg-orange-200 text-orange-800'
                                : comment.status === 'approved'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {comment.status === 'pending' && '⏳ Pendente'}
                              {comment.status === 'approved' && '✓ Aprovado'}
                              {comment.status === 'rejected' && '✗ Rejeitado'}
                            </span>
                          </div>
                          <p className="text-sm text-[#11397a]/70">
                            {new Date(comment.data).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-xl ${
                                star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-[#11397a] mb-2">
                          <strong>Imóvel:</strong> {imovel ? `${imovel.endereco} - ${imovel.cidade_estado}` : `ID: ${comment.imovelId}`}
                        </p>
                        <p className="text-[#11397a] whitespace-pre-wrap">{comment.texto}</p>
                      </div>

                      <div className="flex gap-2">
                        {comment.status === 'pending' && (
                          <>
                            <button
                              onClick={async () => {
                                await approveComment(comment.id);
                                fetchAllComments('pending');
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-bold"
                            >
                              ✓ Aprovar
                            </button>
                            <button
                              onClick={async () => {
                                await rejectComment(comment.id);
                                fetchAllComments('pending');
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
                            >
                              ✗ Rejeitar
                            </button>
                          </>
                        )}
                        <button
                          onClick={async () => {
                            if (window.confirm('Deseja realmente deletar este comentário?')) {
                              await deleteComment(comment.id);
                              fetchAllComments('pending');
                            }
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-bold ml-auto"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
