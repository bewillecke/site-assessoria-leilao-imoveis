/**
 * formatters.js - Funções Utilitárias de Formatação
 * 
 * Este módulo contém funções auxiliares para formatação de dados
 * utilizadas em toda a aplicação, incluindo formatação de moeda,
 * datas e manipulação de arrays.
 */

/**
 * BRL - Formatador de Moeda Brasileira
 * 
 * Instância do Intl.NumberFormat configurada para formatar
 * valores numéricos no padrão monetário brasileiro (R$).
 * 
 * Exemplo de uso: BRL.format(1500.50) → "R$ 1.500,50"
 */
export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * formatDateBR - Formata data ISO para o padrão brasileiro
 * 
 * Converte uma string de data ISO para o formato brasileiro "DD/MM/AAAA".
 * Utiliza toLocaleDateString com locale pt-BR para formatação automática.
 * 
 * @param {string} iso - Data no formato ISO (ex: "2024-12-25T00:00:00.000Z")
 * @returns {string} Data formatada no padrão brasileiro ou a string original em caso de erro
 */
export function formatDateBR(iso) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

/**
 * shufflePick - Embaralha e seleciona elementos aleatórios de um array
 * 
 * Utiliza o algoritmo Fisher-Yates para embaralhar o array de forma
 * eficiente e uniformemente aleatória, retornando os primeiros N elementos.
 * 
 * O algoritmo percorre o array do final ao início, trocando cada elemento
 * com um elemento em posição aleatória anterior (ou igual), garantindo
 * que cada permutação tenha a mesma probabilidade.
 * 
 * Casos de uso: Selecionar imóveis aleatórios para exibir na home,
 * criar carrosséis com itens variados, etc.
 * 
 * @param {Array} arr - Array original a ser embaralhado
 * @param {number} n - Quantidade de elementos a retornar
 * @returns {Array} Subarray com N elementos embaralhados aleatoriamente
 */
export function shufflePick(arr, n) {
  // Cria uma cópia superficial para não modificar o array original
  const a = arr.slice();
  
  // Algoritmo Fisher-Yates (também conhecido como Knuth shuffle)
  for (let i = a.length - 1; i > 0; i--) {
    // Seleciona índice aleatório de 0 até i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Troca elementos usando destructuring assignment
    [a[i], a[j]] = [a[j], a[i]];
  }
  
  // Retorna apenas os primeiros N elementos do array embaralhado
  return a.slice(0, n);
}
