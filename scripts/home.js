(async function () {
  const viewport = document.querySelector('.car-viewport');
  const track = document.querySelector('#container-imagens');
  const prevBtn = document.querySelector('.car-btn.prev');
  const nextBtn = document.querySelector('.car-btn.next');
  if (!viewport || !track) return;

  // ===== utilitários de formatação =====
  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtData = iso => new Date(iso).toLocaleDateString('pt-BR');

  // ===== 1) Buscar e montar cards aleatórios do JSON =====
  async function carregarImoveis() {
    try {
      const resp = await fetch('data/imoveis.json');
      const imoveis = await resp.json();

      // embaralha e pega até 8
      const selecionados = imoveis
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

      // limpa e injeta cards com a mesma estrutura de Oportunidades
      track.innerHTML = '';
      selecionados.forEach((imovel) => {
        const card = document.createElement('div');
        card.className = 'card-imovel';
        card.innerHTML = `
          <div class="thumb">
            <img src="data/${imovel.foto}" alt="Imóvel em ${imovel.cidade_estado}">
          </div>
          <h3 class="preco-imovel">${BRL.format(Number(imovel.preco))}</h3>
          <p class="info-imovel">${imovel.cidade_estado}</p>
          <p class="info-imovel">${imovel.quartos} quarto(s) · ${imovel.banheiros} banheiro(s)</p>
          <p class="info-imovel">${imovel.tamanho_m2} m²</p>
          <p class="info-imovel">Data do leilão: ${fmtData(imovel.data_leilao)}</p>
        `;
        track.appendChild(card);
      });
    } catch (e) {
      console.error('Falha ao carregar imóveis para o carrossel:', e);
    }
  }

  // ===== 2) Lógica do carrossel =====
  function slideStep() {
    const cards = track.querySelectorAll('.card-imovel');
    if (cards.length < 2) return viewport.clientWidth;
    const a = cards[0].getBoundingClientRect();
    const b = cards[1].getBoundingClientRect();
    const gap = Math.round(b.left - a.right);
    const cardW = Math.round(cards[0].offsetWidth);
    return cardW + Math.max(gap, 16);
  }

  function goNext() {
    viewport.scrollBy({ left: slideStep(), behavior: 'smooth' });
  }
  function goPrev() {
    viewport.scrollBy({ left: -slideStep(), behavior: 'smooth' });
  }

  function ligarControles() {
    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);

    // autoplay (pausa no hover/focus)
    let timer;
    const START = () => { STOP(); timer = setInterval(goNext, 4000); };
    const STOP  = () => { if (timer) clearInterval(timer); };

    viewport.addEventListener('mouseenter', STOP);
    viewport.addEventListener('mouseleave', START);
    viewport.addEventListener('focusin', STOP);
    viewport.addEventListener('focusout', START);
    window.addEventListener('blur', STOP);
    window.addEventListener('focus', START);

    // rebobina quando chega ao fim
    viewport.addEventListener('scroll', () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
      if (viewport.scrollLeft >= maxScroll) {
        setTimeout(() => viewport.scrollTo({ left: 0, behavior: 'smooth' }), 600);
      }
    });

    let rTO;
    window.addEventListener('resize', () => {
      clearTimeout(rTO);
      rTO = setTimeout(() => {}, 120);
    });

    START();
  }

  // ===== 3) Fluxo: carrega → então liga o carrossel =====
  await carregarImoveis();
  ligarControles();
})();
