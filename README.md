# 🏠 Dominus Soli — Assessoria em Leilão de Imóveis

Projeto de **site institucional moderno** para a **Dominus Soli**, empresa especializada em assessoria para leilões de imóveis.  
Agora reestruturado com **React + Vite + Tailwind CSS**, visando desempenho, escalabilidade e manutenção facilitada.

---

## 📌 Status do Projeto

🚧 **Em migração** — o projeto está sendo reescrito em **React + Tailwind CSS**, mantendo o design e as seções originais do site estático em HTML/CSS/JS.

- [x] Configuração inicial com **Vite + React**
- [x] Instalação e integração do **Tailwind CSS (v4)**
- [ ] Criação dos componentes da Home
- [ ] Adaptação dos estilos antigos para classes utilitárias Tailwind
- [ ] Implementação das páginas adicionais (Contato, Oportunidades, etc.)
- [ ] Deploy de preview no GitHub Pages / Vercel

---

## 🧭 Estrutura Atual de Pastas

```plaintext
dominus-soli/
│
├── public/                  # Arquivos estáticos (imagens, ícones, etc.)
│
├── src/
│   ├── assets/              # Imagens e ícones internos
│   ├── components/          # Componentes reutilizáveis (Header, Footer, Cards, etc.)
│   ├── pages/               # Páginas do site (Home, Contato, etc.)
│   ├── index.css            # Import principal do TailwindCSS
│   ├── App.jsx              # Roteamento e estrutura principal
│   └── main.jsx             # Ponto de entrada do React
│
├── .gitignore
├── index.html               # HTML base (Vite)
├── package.json
├── postcss.config.js        # Configuração do PostCSS (Tailwind + Autoprefixer)
├── tailwind.config.js       # Configuração do TailwindCSS (v4)
├── vite.config.js           # Configuração do Vite
└── README.md

## 🧰 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|-------------|
| **Frontend** | [React](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer) |
| **Linguagem** | JavaScript (ESNext) |
| **Controle de versão** | Git + GitHub |
| **Outros** | Google Fonts, Font Awesome (para ícones futuros) |

---

## 🎯 Objetivo da Migração

A transição para React e Tailwind tem como propósito:

- **Melhorar o desempenho** (builds otimizadas via Vite);
- **Facilitar manutenção e reuso de componentes**;
- **Simplificar o CSS**, substituindo arquivos separados por utilitários Tailwind;
- **Preparar o projeto para expansão futura**, como:
  - Integração de filtros dinâmicos de imóveis;
  - Backend (Node.js ou Firebase);
  - Painel administrativo.

---

## 🚀 Como rodar localmente

### 1) Clonar e instalar
```bash
git clone https://github.com/<seu-usuario>/dominus-soli.git
cd dominus-soli
npm install
```

### 2) Ambiente de desenvolvimento
```bash
npm run dev
```
> O Vite sobe em algo como `http://localhost:5173`.

### 3) Build de produção
```bash
npm run build
```

### 4) Pré-visualizar o build
```bash
npm run preview
```

---

## 🧩 Estrutura React + Tailwind (exemplo de componente)
```jsx
// src/components/CardImovel.jsx
export default function CardImovel({ titulo, preco, imagem }) {
  return (
    <div className="bg-white border border-blue-800/30 rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden">
      <img src={imagem} alt={titulo} className="w-full h-60 object-cover" />
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-blue-800">{titulo}</h2>
        <p className="mt-2 text-slate-600">{preco}</p>
      </div>
    </div>
  );
}
```

---

## 📚 Estrutura Antiga x Nova (referência)
| Antes (HTML/CSS/JS) | Agora (React/Tailwind) |
|----------------------|------------------------|
| `home.html` | `src/pages/Home.jsx` |
| `contato.html` | `src/pages/Contato.jsx` |
| `css/global.css` | Classes utilitárias do Tailwind |
| `scripts/global.js` | Hooks e componentes React |

---

## 🧩 Dados (JSON)
```jsx
import { useEffect, useState } from "react";

export function useImoveis() {
  const [lista, setLista] = useState([]);
  useEffect(() => {
    fetch("/src/data/imoveis.json")
      .then(r => r.json())
      .then(setLista)
      .catch(console.error);
  }, []);
  return lista;
}
```

---

## 🛠️ Troubleshooting

- **Erro PostCSS/Tailwind v4:** use `@import "tailwindcss";` no `src/index.css` e remova o `postcss.config.js` antigo.  
- **Porta ocupada:** rode `npm run dev -- --port 5174`.  
- **404 ao consumir JSON:** se necessário, mova o arquivo para `public/imoveis.json` e acesse com `fetch("/imoveis.json")`.

---

## 📦 Deploy (Netlify / Vercel)

- **Build command:** `npm run build`  
- **Publish directory:** `dist`  
- **SPA fallback:** use `/* /index.html 200` (Netlify) — na Vercel isso é automático.

---

## 👨‍💻 Autor

**Bernardo Willecke**  
💼 Engenhero de Dados, Desenvolvedor e estudante de Engenharia de Software  
📍 Brasil  
📧 [GitHub](https://github.com/bewillecke)

> _“Transformando conhecimento em portfólio, e portfólio em oportunidades.”_

