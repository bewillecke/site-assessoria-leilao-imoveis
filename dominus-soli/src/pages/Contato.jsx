/**
 * Contato.jsx - Página de Contato
 * 
 * Formulário para visitantes entrarem em contato com a Dominus Soli.
 * As mensagens são enviadas para o servidor e ficam disponíveis
 * no painel administrativo para resposta.
 * 
 * Campos do formulário:
 * - Nome: Nome completo do interessado
 * - Email: Email para resposta
 * - Mensagem: Texto livre com a dúvida ou solicitação
 * 
 * Funcionalidades:
 * - Validação de campos obrigatórios (HTML5 required)
 * - Feedback visual de sucesso/erro
 * - Loading state durante envio
 * - Dispara evento de analytics para rastreamento
 * - Limpa formulário após envio bem-sucedido
 * 
 * Estados:
 * - formData: Dados atuais do formulário
 * - loading: Indica se está enviando
 * - message: Feedback para o usuário (sucesso ou erro)
 */

import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE}/api/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setMessage({ type: 'success', text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' });
      setFormData({ nome: "", email: "", mensagem: "" });
      
      try {
        const event = new CustomEvent('analytics:contato', {
          detail: { origem: 'formulario_contato' }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Erro ao registrar analytics:', error);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro ao enviar mensagem. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Navbar />

      <section className="bg-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-[#11397a] text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contato</h2>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm sm:text-base ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <label htmlFor="nome" className="text-[#11397a] font-bold text-base sm:text-lg mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] rounded-lg bg-white text-[#11397a] text-sm sm:text-base focus:border-[#11397a] focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 transition-all"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label htmlFor="email" className="text-[#11397a] font-bold text-base sm:text-lg mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] rounded-lg bg-white text-[#11397a] text-sm sm:text-base focus:border-[#11397a] focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="mensagem" className="text-[#11397a] font-bold text-base sm:text-lg mb-2">
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  required
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows="8"
                  className="w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] rounded-lg bg-white text-[#11397a] text-sm sm:text-base focus:border-[#11397a] focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 transition-all resize-vertical"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#11397a] text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-[#0e2f68] transition-colors self-start disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </div>

            <aside className="flex-1 text-[#11397a] font-medium text-sm sm:text-base md:text-lg leading-relaxed">
              <p className="mt-0 sm:mt-4 md:mt-7">
                Quer investir com segurança e inteligência no mercado de leilões? Preencha o formulário ao lado
                e fale com especialistas em oportunidades imobiliárias de alto potencial.
                Oferecemos assessoria completa para investidores que buscam rentabilidade, segurança jurídica e
                agilidade em cada etapa — da análise do edital à arrematação e regularização do imóvel.
                Nosso trabalho é transformar leilões em investimentos sólidos e lucrativos.
              </p>
            </aside>
          </div>
        </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
