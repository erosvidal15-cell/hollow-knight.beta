// ÂNCORAS NO CARREGAMENTO: ao abrir uma URL como index.html#categorias, o navegador salta ANTES de o JavaScript
// criar o cabeçalho e as categorias, e o destino fica fora de lugar quando o layout termina de mudar.
// Aqui reposicionamos UMA vez, depois de tudo montado, a menos que o visitante já tenha rolado ou interagido.
let touched = false;
if (typeof window !== 'undefined') {
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.addEventListener(type, () => { touched = true; }, { once: true, passive: true });
}

export async function initAnchor() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (!target) return; // sem âncora, ou o "#id" é o de uma ficha (esse caso abre o modal)
  await Promise.race([document.fonts?.ready, new Promise((resolve) => setTimeout(resolve, 1500))]); // as fontes também mudam o layout
  if (!touched) target.scrollIntoView({ behavior: 'instant', block: 'start' }); // scroll-margin-top deixa o destino abaixo do cabeçalho
}
