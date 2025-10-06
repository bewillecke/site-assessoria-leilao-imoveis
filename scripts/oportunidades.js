"use strict";

/* ========= Estado e util ========= */
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let IMOVEIS = [];   // dados carregados do JSON
const container = document.getElementById('container-imoveis');

const el = id => /** @type {HTMLElement|null} */(document.getElementById(id));
const precoMin = /** @type {HTMLInputElement|null} */(el('preco-min'));
const precoMax = /** @type {HTMLInputElement|null} */(el('preco-max'));
const precoMinOut = el('preco-min-out');
const precoMaxOut = el('preco-max-out');

const m2Min = /** @type {HTMLInputElement|null} */(el('m2-min'));
const m2Max = /** @type {HTMLInputElement|null} */(el('m2-max'));
const m2MinOut = el('m2-min-out');
const m2MaxOut = el('m2-max-out');

const cidadeInput = /** @type {HTMLInputElement|null} */(el('cidade-input'));
const quartosInput = /** @type {HTMLInputElement|null} */(el('quartos-input'));
const banheirosInput = /** @type {HTMLInputElement|null} */(el('banheiros-input'));

const MIN_GAP_PRECO = 5000;
const MIN_GAP_M2 = 5;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ========= Renderização ========= */
function cardHTML(imovel){
  return `
    <div class="card-imovel">
      <div class="thumb">
        <img src="data/${imovel.foto}" alt="${imovel.cidade_estado || 'Imóvel'}">
      </div>
      <h3 class="preco-imovel">${BRL.format(Number(imovel.preco))}</h3>
      <p class="info-imovel">${imovel.cidade_estado}</p>
      <p class="info-imovel">${imovel.quartos} quarto(s) · ${imovel.banheiros} banheiro(s)</p>
      <p class="info-imovel">${imovel.tamanho_m2} m²</p>
      <p class="info-imovel">Data do leilão: ${new Date(imovel.data_leilao).toLocaleDateString('pt-BR')}</p>
    </div>
  `;
}

function render(lista){
  if (!container) return;
  if (!lista.length){
    container.innerHTML = `<p class="sem-resultados" style="color:#11397a;font-weight:600;">Nenhum imóvel encontrado com os filtros atuais.</p>`;
    return;
  }
  container.innerHTML = lista.map(cardHTML).join('');
}

/* ========= Filtros ========= */
function getFiltros(){
  const pMin = precoMin ? Number(precoMin.value) : 0;
  const pMax = precoMax ? Number(precoMax.value) : Number.MAX_SAFE_INTEGER;
  const aMin = m2Min ? Number(m2Min.value) : 0;
  const aMax = m2Max ? Number(m2Max.value) : Number.MAX_SAFE_INTEGER;

  const cidade = (cidadeInput?.value || '').trim().toLowerCase();
  const q = Number(quartosInput?.value || 0);
  const b = Number(banheirosInput?.value || 0);

  return { pMin, pMax, aMin, aMax, cidade, q, b };
}

function aplicaFiltros(){
  const { pMin, pMax, aMin, aMax, cidade, q, b } = getFiltros();

  const lista = IMOVEIS.filter(x => {
    const okPreco = Number(x.preco) >= pMin && Number(x.preco) <= pMax;
    const okM2 = Number(x.tamanho_m2) >= aMin && Number(x.tamanho_m2) <= aMax;
    const okCidade = !cidade || String(x.cidade_estado || '').toLowerCase().includes(cidade);
    const okQuartos = !q || Number(x.quartos) === q;
    const okBanheiros = !b || Number(x.banheiros) === b;
    return okPreco && okM2 && okCidade && okQuartos && okBanheiros;
  });

  render(lista);
}

let tDebounce;
function filtrarImoveisDebounced(){
  clearTimeout(tDebounce);
  tDebounce = setTimeout(aplicaFiltros, 100);
}

/* ========= Sliders duplos (fill + outputs) ========= */
function setRangeFill(elContainer, minInput, maxInput){
  if (!elContainer || !minInput || !maxInput) return;
  const min = Number(minInput.min), max = Number(maxInput.max);
  const vMin = Number(minInput.value), vMax = Number(maxInput.value);
  const start = ((vMin - min) / (max - min)) * 100;
  const end = ((vMax - min) / (max - min)) * 100;
  elContainer.style.setProperty('--fill-start', `${start}%`);
  elContainer.style.setProperty('--fill-end', `${end}%`);
}

function updatePrecoOut(){
  if (precoMinOut) precoMinOut.textContent = BRL.format(Number(precoMin?.value || 0));
  if (precoMaxOut) precoMaxOut.textContent = BRL.format(Number(precoMax?.value || 0));
  if (precoMin && precoMax) setRangeFill(precoMin.closest('.range-duplo'), precoMin, precoMax);
}
function updateM2Out(){
  if (m2MinOut) m2MinOut.textContent = `${m2Min?.value || 0} m²`;
  if (m2MaxOut) m2MaxOut.textContent = `${m2Max?.value || 0} m²`;
  if (m2Min && m2Max) setRangeFill(m2Min.closest('.range-duplo'), m2Min, m2Max);
}

/* manter consistência quando usuário arrasta pelas setas do teclado, etc. */
if (precoMin && precoMax){
  precoMin.addEventListener('input', () => {
    precoMin.value = String(clamp(Number(precoMin.value), Number(precoMin.min), Number(precoMax.value) - MIN_GAP_PRECO));
    updatePrecoOut();
    filtrarImoveisDebounced();
  });
  precoMax.addEventListener('input', () => {
    precoMax.value = String(clamp(Number(precoMax.value), Number(precoMin.value) + MIN_GAP_PRECO, Number(precoMax.max)));
    updatePrecoOut();
    filtrarImoveisDebounced();
  });
}
if (m2Min && m2Max){
  m2Min.addEventListener('input', () => {
    m2Min.value = String(clamp(Number(m2Min.value), Number(m2Min.min), Number(m2Max.value) - MIN_GAP_M2));
    updateM2Out();
    filtrarImoveisDebounced();
  });
  m2Max.addEventListener('input', () => {
    m2Max.value = String(clamp(Number(m2Max.value), Number(m2Min.value) + MIN_GAP_M2, Number(m2Max.max)));
    updateM2Out();
    filtrarImoveisDebounced();
  });
}

/* ========= Clique + arraste na barra inteira (dual slider) ========= */
(function rangeDragOnContainer(){
  function valueFromClientX(box, input, clientX){
    const rect = box.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const t = x / rect.width; // 0..1
    const min = Number(input.min), max = Number(input.max);
    const step = Number(input.step || 1);
    const raw = min + t * (max - min);
    return Math.round(raw / step) * step;
  }

  document.querySelectorAll('.range-duplo').forEach(box => {
    const inputs = box.querySelectorAll('input[type="range"]');
    if (inputs.length !== 2) return;
    const [minInput, maxInput] = /** @type {[HTMLInputElement, HTMLInputElement]} */(inputs);

    let dragging = null;
    const isPreco = minInput.id.includes('preco');

    function clampWithGap(val){
      if (dragging === 'min'){
        const maxAllowed = Number(maxInput.value) - (isPreco ? MIN_GAP_PRECO : MIN_GAP_M2);
        return Math.min(val, maxAllowed);
      } else {
        const minAllowed = Number(minInput.value) + (isPreco ? MIN_GAP_PRECO : MIN_GAP_M2);
        return Math.max(val, minAllowed);
      }
    }

    function chooseThumbByPosition(clientX){
      const val = valueFromClientX(box, minInput, clientX);
      const dMin = Math.abs(val - Number(minInput.value));
      const dMax = Math.abs(val - Number(maxInput.value));
      dragging = (dMin <= dMax) ? 'min' : 'max';
      return val;
    }

    function applyFromClientX(clientX){
      const raw = valueFromClientX(box, minInput, clientX);
      const val = clampWithGap(raw);
      const target = (dragging === 'min') ? minInput : maxInput;
      target.value = String(val);
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function start(e){
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      chooseThumbByPosition(clientX);
      applyFromClientX(clientX);
      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('mouseup', end, { once: true });
      window.addEventListener('touchend', end, { once: true });
      e.preventDefault();
    }
    function move(e){
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      applyFromClientX(clientX);
      if (e.cancelable) e.preventDefault();
    }
    function end(){
      dragging = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
    }

    box.addEventListener('mousedown', start);
    box.addEventListener('touchstart', start, { passive: false });
  });
})();

/* ========= Inputs de texto/número filtragem ========= */
[cidadeInput, quartosInput, banheirosInput].forEach(inp => {
  if (!inp) return;
  inp.addEventListener('input', filtrarImoveisDebounced);
});

/* ========= Carregamento dos imóveis ========= */
fetch('data/imoveis.json')
  .then(r => r.json())
  .then(data => {
    IMOVEIS = Array.isArray(data) ? data : [];
    render(IMOVEIS);
    // inicializa outputs/fill depois que a página já está pronta
    updatePrecoOut();
    updateM2Out();
  })
  .catch(err => {
    console.error('Erro ao carregar imoveis.json', err);
    if (container) container.innerHTML = `<p style="color:#b00;font-weight:600;">Falha ao carregar as oportunidades.</p>`;
  });

  // ========= Botão "Limpar Filtros" =========
document.getElementById('btn-limpar-filtros')?.addEventListener('click', () => {
  // Reset sliders
  if (precoMin && precoMax) {
    precoMin.value = precoMin.min;
    precoMax.value = precoMax.max;
    updatePrecoOut();
  }
  if (m2Min && m2Max) {
    m2Min.value = m2Min.min;
    m2Max.value = m2Max.max;
    updateM2Out();
  }

  // Reset text/number inputs
  if (cidadeInput) cidadeInput.value = '';
  if (quartosInput) quartosInput.value = '';
  if (banheirosInput) banheirosInput.value = '';

  // Atualiza fill e aplica filtro
  setRangeFill(precoMin?.closest('.range-duplo'), precoMin, precoMax);
  setRangeFill(m2Min?.closest('.range-duplo'), m2Min, m2Max);
  aplicaFiltros();
});
