import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(credentials.username, credentials.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-[#11397a]/20">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-[#11397a]">
              Painel Administrativo
            </h2>
            <p className="mt-2 text-center text-sm text-[#11397a]/70">
              Faça login para acessar
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="text-[#11397a] font-bold mb-2 block">
                  Usuário
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                  placeholder="Digite seu usuário"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-[#11397a] font-bold mb-2 block">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border-2 border-[#11397a33] placeholder-gray-500 text-[#11397a] focus:outline-none focus:ring-2 focus:ring-[#11397a]/15 focus:border-[#11397a] transition-all"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#11397a] hover:bg-[#0e2f68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#11397a] transition-colors"
              >
                Entrar
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-[#11397a]/60 mt-4">
                💡 <strong>Credenciais de teste:</strong><br />
                Usuário: <code className="bg-gray-100 px-2 py-1 rounded">admin</code><br />
                Senha: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
