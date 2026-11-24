// Links marcados com [data-pending] (ou .is-pending) apontam para páginas ainda inexistentes.
// Em vez de navegar para lugar nenhum, mostramos um aviso claro.
const MESSAGE = 'Esta página ainda está em desenvolvimento.';
let timer;

export function showToast(message = MESSAGE) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

export function initPendingLinks() {
  // Delegação de eventos: um único listener serve também aos cards criados depois pelo JS.
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-pending]')) return;
    event.preventDefault();
    showToast();
  });
}
