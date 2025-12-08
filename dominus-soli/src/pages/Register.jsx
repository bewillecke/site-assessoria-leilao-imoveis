/**
 * Register.jsx - Página de Cadastro de Usuários
 * 
 * Formulário de registro para novos usuários criarem suas contas.
 * Após cadastro bem-sucedido, o usuário já fica automaticamente logado.
 * 
 * Campos obrigatórios:
 * - Nome completo
 * - Email (usado para login)
 * - Senha
 * - Sexo (seleção: Masculino/Feminino/Outro)
 * - Idade
 * 
 * Validações:
 * - Campos required via HTML5
 * - Email único (validado pela API)
 * 
 * Comportamentos:
 * - Usuário já logado: Redireciona para home (/)
 * - Registro bem-sucedido: Loga automaticamente e redireciona
 * - Registro falhou: Exibe mensagem de erro
 * 
 * Estados:
 * - formData: Todos os campos do formulário
 * - error: Mensagem de erro (se houver)
 * 
 * Link para login disponível para usuários existentes.
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sexo: '',
    idade: ''
  });
  const [error, setError] = useState('');
  const { user, register } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(formData);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-[#11397a]/20">
          <div>
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#11397a]">
              Crie sua conta
            </h2>
          </div>
          <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="text-[#11397a] font-bold mb-2 block text-sm sm:text-base">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-[#11397a] font-bold mb-2 block text-sm sm:text-base">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-[#11397a] font-bold mb-2 block text-sm sm:text-base">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                  placeholder="Sua senha"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="sexo" className="text-[#11397a] font-bold mb-2 block text-sm sm:text-base">
                    Sexo
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    required
                    value={formData.sexo}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label htmlFor="idade" className="text-[#11397a] font-bold mb-2 block text-sm sm:text-base">
                    Idade
                  </label>
                  <input
                    id="idade"
                    name="idade"
                    type="number"
                    required
                    value={formData.idade}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                    placeholder="Idade"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-xs sm:text-sm font-bold rounded-lg text-white bg-[#11397a] hover:bg-[#0e2f68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#11397a] transition-colors"
              >
                Cadastrar
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-[#11397a]/70">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-bold text-[#11397a] hover:text-[#0e2f68]">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
