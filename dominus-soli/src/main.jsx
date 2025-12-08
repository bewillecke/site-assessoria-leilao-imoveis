/**
 * main.jsx - Ponto de Entrada da Aplicação React
 * 
 * Este arquivo é o ponto de entrada principal da aplicação.
 * Responsável por inicializar o React e renderizar o componente raiz (App)
 * dentro do elemento HTML com id "root".
 * 
 * O StrictMode é utilizado para identificar potenciais problemas durante
 * o desenvolvimento, como efeitos colaterais e APIs depreciadas.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Cria a raiz do React e renderiza a aplicação dentro do modo estrito
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
