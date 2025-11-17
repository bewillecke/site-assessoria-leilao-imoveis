# Dominus Soli - Site de Assessoria em Leilão de Imóveis

Projeto acadêmico desenvolvido com React + Vite + Tailwind CSS para assessoria especializada em leilões de imóveis.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

### Executar o Projeto

**IMPORTANTE: Você precisa rodar 2 terminais simultaneamente!**

#### Terminal 1 - Backend (Servidor Node.js)
```bash
npm run dev:server
```
Isso inicia o servidor backend na porta **4000**

#### Terminal 2 - Frontend (Vite)
```bash
npm run dev
```
Isso inicia o frontend (geralmente na porta **5173**)

### Acessar o Site

- **Home:** http://localhost:5173/
- **Oportunidades:** http://localhost:5173/oportunidades
- **Quem Somos:** http://localhost:5173/quem-somos
- **Contato:** http://localhost:5173/contato
- **🔐 Painel Admin:** http://localhost:5173/admin
- **Detalhes do Imóvel:** http://localhost:5173/imovel/:id (clique em qualquer card)

## 📁 Estrutura do Projeto

```
dominus-soli/
├── public/
│   ├── imoveis.json          # Base de dados dos imóveis
│   └── data/imagens/imoveis/ # Imagens dos imóveis
├── server/
│   └── index.js              # Servidor backend Express
├── src/
│   ├── components/           # Componentes reutilizáveis
│   ├── pages/                # Páginas principais
│   │   ├── Home.jsx
│   │   ├── Oportunidades.jsx
│   │   ├── QuemSomos.jsx
│   │   ├── Contato.jsx
│   │   ├── Admin.jsx
│   │   └── ImovelDetalhes.jsx  # ✨ NOVA PÁGINA!
│   └── utils/                # Funções auxiliares
└── package.json
```

## ✨ Funcionalidades Implementadas

- ✅ Listagem de imóveis com filtros avançados
- ✅ Carrossel de imóveis em destaque
- ✅ Mapa interativo com Leaflet
- ✅ Página de detalhes do imóvel (NOVA!)
- ✅ Compartilhamento em redes sociais
- ✅ Calculadora de investimento
- ✅ Imóveis similares
- ✅ Painel administrativo para cadastro
- ✅ Formulário de contato
- ✅ Design responsivo com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, React Router DOM
- **Estilização:** Tailwind CSS
- **Mapas:** Leaflet + React Leaflet
- **Backend:** Node.js + Express
- **Build Tool:** Vite
- **Linting:** ESLint

## 📝 Scripts Disponíveis

```bash
npm run dev              # Roda o frontend (Vite)
npm run dev:server       # Roda o backend (nodemon)
npm run build           # Build de produção
npm run preview         # Preview do build
npm run lint            # Executa o ESLint
```

## 🎓 Projeto Acadêmico

Este é um projeto desenvolvido para fins acadêmicos com foco em:
- Desenvolvimento Full Stack
- Integração Frontend/Backend
- UX/UI moderno e responsivo
- Boas práticas de código

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
