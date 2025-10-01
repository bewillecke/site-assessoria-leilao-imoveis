fetch('data/imoveis.json')
  .then(response => response.json())
  .then(imoveis => {
    const container = document.getElementById('container-imoveis');
    imoveis.forEach(imovel => {
      const card = document.createElement('div');
      card.classList.add('card-imovel');
      card.innerHTML = `
      <div class="thumb">
        <img src="data/${imovel.foto}" alt="Imóvel genérico">
      </div>
        <h3 class="preco-imovel">${imovel.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
        <p class="info-imovel">${imovel.cidade_estado}</p>
        <p class="info-imovel">${imovel.quartos} quarto(s) · ${imovel.banheiros} banheiro(s)</p>
        <p class="info-imovel">${imovel.tamanho_m2}m²</p>
        <p class="info-imovel">Data do leilão: ${new Date(imovel.data_leilao).toLocaleDateString()}</p>
      `;
      container.appendChild(card);
    });
  });

  const outputPreco = document.getElementById('valorPrecoInput');
  outputPreco.innerHTML = outputPreco.toLocaleDateString('pt-BR', {style: 'currency', currency: 'BRL'});