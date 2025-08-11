# 🏠 Dominus Soli — Assessoria em Leilão de Imóveis

Projeto de um site institucional para a **Dominus Soli**, assessoria especializada em leilões de imóveis.  
O objetivo é compor **portfólio** demonstrando organização de projeto, HTML semântico, CSS modularizado e JavaScript básico.

---

## 📌 Status

🚧 **Em desenvolvimento** — novas páginas, conteúdo e melhorias de responsividade/JS serão adicionadas.

---

## 📂 Estrutura de Pastas

```plaintext
SITE_ASSESSORIA_LEILAO/
│
├── css/
│   ├── global.css        # Estilos compartilhados entre páginas
│   ├── home.css          # Estilos específicos da Home
│   └── contato.css       # Estilos específicos da página Contato
│
├── scripts/
│   └── global.js         # Funções JS (ex.: links de redes sociais)
│
├── home.html             # Página inicial
├── contato.html          # Página de contato
├── README.md
└── requirements.txt      # Reservado para anotações futuras
```

## 🗺 Páginas

- **`home.html`** — cabeçalho, navegação, imóveis em destaque, sessão “quem somos” e rodapé com redes sociais.  
- **`contato.html`** — formulário (nome, e-mail, mensagem), texto institucional lateral e rodapé com redes sociais.  
- **(futuro) `oportunidades.html`** — listagem de imóveis com filtros (preço, cidade, bairro, quartos, m², data do leilão).

---

## 🎯 Funcionalidades

- **Layout multi-página** com navegação entre seções/páginas.
- **CSS modular**: `global.css` para estilos compartilhados + CSS específico por página.
- **Rodapé com ícones** (Font Awesome) e links para redes sociais.
- **Boas práticas de semântica** (sections, footer, nav, etc.).
- **Base para futura listagem dinâmica** de imóveis.

---

## 🧰 Tecnologias

- **HTML5**
- **CSS3**
- **JavaScript (puro)**
- **Font Awesome** (ícones via CDN)
- **Google Fonts** (tipografia Montserrat)

## 🚀 Como rodar localmente

1. **Clone o repositório**
    ```bash
    git clone https://github.com/<seu-usuario>/SITE_ASSESSORIA_LEILAO.git
    cd SITE_ASSESSORIA_LEILAO
    ```

2. **Abra a página inicial**
    - Clique duas vezes em `home.html` para abrir no navegador, **ou**
    - Use a extensão **Live Server** no VS Code:
        - Instale a extensão “Live Server”
        - Clique com o botão direito em `home.html` → **Open with Live Server**

3. **Navegue entre as páginas**
    - Menu superior: *Home*, *Quem Somos* (âncora), *Leilão* (placeholder), *Oportunidades* (em breve), *Contatos*.

> ⚠ Se os ícones do rodapé não aparecerem, confirme que a **CDN do Font Awesome** está carregando (é necessário internet).
