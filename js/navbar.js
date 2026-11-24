// Comportamento do cabeçalho: menu no celular e submenu "Explorar" (sem Bootstrap).
export function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle'), menu = header.querySelector('#site-menu'), explore = header.querySelector('details.explore');

  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  // O submenu fecha ao clicar fora, ao escolher um link e com ESC
  document.addEventListener('click', (e) => { if (explore?.open && !explore.contains(e.target)) explore.open = false; });
  explore?.addEventListener('click', (e) => { if (e.target.closest('a')) explore.open = false; });
  header.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (explore?.open) { explore.open = false; explore.querySelector('summary').focus(); }
    else if (menu?.classList.contains('is-open')) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
}
