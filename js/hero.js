// Efeitos da hero: partículas de luz e parallax sutil. Ambos respeitam "reduzir movimento".
const rand = (min, max) => Math.random() * (max - min) + min;

export function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Partículas: menos no celular, para economizar bateria
  const count = innerWidth < 768 ? 14 : 30;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const mote = document.createElement('span');
    mote.className = 'hero__mote';
    mote.style.cssText = `--x:${rand(0, 100)}%;--s:${rand(2, 5)}px;--d:${rand(10, 22)}s;--delay:-${rand(0, 22)}s;--drift:${rand(-50, 50)}px`;
    fragment.append(mote);
  }
  hero.querySelector('.hero__motes').append(fragment);

  // Parallax: só com mouse. Guardamos a posição em variáveis CSS (--mx, --my de -0.5 a 0.5)
  if (!matchMedia('(pointer: fine)').matches) return;
  let frame;
  const setPointer = (x, y) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      hero.style.setProperty('--mx', x.toFixed(3));
      hero.style.setProperty('--my', y.toFixed(3));
    });
  };
  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    setPointer((event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5);
  });
  hero.addEventListener('pointerleave', () => setPointer(0, 0));
}
