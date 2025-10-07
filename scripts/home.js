(function(){
  const viewport = document.querySelector('.car-viewport');
  const track = document.querySelector('.car-track');
  const prevBtn = document.querySelector('.car-btn.prev');
  const nextBtn = document.querySelector('.car-btn.next');
  if (!viewport || !track) return;

  function slideStep(){
    const cards = track.querySelectorAll('.imovel');
    if (cards.length < 2) return viewport.clientWidth;
    const a = cards[0].getBoundingClientRect();
    const b = cards[1].getBoundingClientRect();
    const gap = Math.round(b.left - a.right);
    const cardW = Math.round(cards[0].offsetWidth);
    return cardW + Math.max(gap, 16);
  }

  function goNext(){
    viewport.scrollBy({ left: slideStep(), behavior: 'smooth' });
  }
  function goPrev(){
    viewport.scrollBy({ left: -slideStep(), behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  // autoplay
  let timer;
  const START = () => { stop(); timer = setInterval(goNext, 4000); };
  const stop  = () => { if (timer) clearInterval(timer); };
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', START);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', START);
  window.addEventListener('blur', stop);
  window.addEventListener('focus', START);

  viewport.addEventListener('scroll', () => {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
    if (viewport.scrollLeft >= maxScroll){
      setTimeout(() => viewport.scrollTo({ left: 0, behavior: 'smooth' }), 600);
    }
  });

  // recomeça autoplay e recalc passo em resize
  let rTO;
  window.addEventListener('resize', () => {
    clearTimeout(rTO);
    rTO = setTimeout(() => {}, 100);
  });

  // inicia
  START();
})();
