/**
 * AuthContext.jsx - Contexto de Autenticação
 * 
 * Este contexto gerencia todo o estado e lógica de autenticação da aplicação.
 * Fornece funcionalidades de login, registro e logout para os componentes filhos.
 * 
 * Funcionalidades principais:
 * - login(email, password): Autentica usuários via API
 * - register(userData): Cria novas contas de usuário
 * - logout(): Encerra a sessão do usuário
 * 
 * Persistência: O estado do usuário é salvo no localStorage para manter
 * a sessão ativa mesmo após recarregar a página.
 * 
 * Uso: Utilize o hook useAuth() para acessar user, loading, login, register e logout
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto com valor inicial null
const AuthContext = createContext(null);

/**
 * AuthProvider - Componente provedor de autenticação
 * 
 * Envolve a aplicação e fornece o contexto de autenticação para todos
 * os componentes filhos. Gerencia o estado do usuário e operações de auth.
 * 
 * @param {ReactNode} children - Componentes filhos que terão acesso ao contexto
 */
export function AuthProvider({ children }) {
  // Estado do usuário atual (null se não autenticado)
  const [user, setUser] = useState(null);
  // Estado de carregamento - true enquanto verifica localStorage na inicialização
  const [loading, setLoading] = useState(true);

  // Efeito executado na montagem: restaura sessão do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * login - Autentica um usuário existente
   * 
   * Envia credenciais para a API e, em caso de sucesso,
   * armazena os dados do usuário no estado e localStorage.
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object} { success: boolean, error?: string }
   */
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  /**
   * register - Registra um novo usuário
   * 
   * Envia dados do novo usuário para a API. Em caso de sucesso,
   * o usuário já fica automaticamente logado.
   * 
   * @param {Object} userData - Dados do usuário (name, email, password, sexo, idade)
   * @returns {Object} { success: boolean, error?: string }
   */
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  /**
   * logout - Encerra a sessão do usuário
   * 
   * Limpa o estado do usuário e remove os dados do localStorage,
   * efetivamente deslogando o usuário da aplicação.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Fornece o contexto para todos os componentes filhos
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - Hook personalizado para acessar o contexto de autenticação
 * 
 * Fornece acesso ao estado e funções de autenticação.
 * Deve ser usado apenas dentro de componentes envolvidos pelo AuthProvider.
 * 
 * @returns {Object} { user, loading, login, register, logout }
 * @throws {Error} Se usado fora do AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
