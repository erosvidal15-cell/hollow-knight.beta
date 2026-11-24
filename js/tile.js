// Miniatura reutilizável (catálogos e destaques) e placeholder de imagem ausente.
import { ICONS } from './icons.js';
import { escapeHTML, withRoot } from './utils.js';

export const placeholderHTML = (icon) => `<span class="ph" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[icon] ?? ICONS.lore}</svg></span>`;

// A imagem é decorativa (o nome aparece logo abaixo), por isso alt="". Na ficha do modal ela recebe alt descritivo.
export function tileHTML(item, icon) {
  const img = item.image
    ? `<img src="${escapeHTML(withRoot(item.image))}" alt="" loading="lazy" decoding="async" data-icon="${escapeHTML(icon)}">`
    : placeholderHTML(icon);
  return `<li><button type="button" class="tile" data-open="${escapeHTML(item.id)}"><span class="tile__img">${img}</span><span class="tile__name">${escapeHTML(item.name)}</span>${item.demo ? '<span class="tile__flag">Demonstração</span>' : ''}</button></li>`;
}

// Imagem que falha ao carregar vira placeholder. O evento "error" não borbulha, por isso usamos a fase de captura.
export function initImageFallback() {
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.icon) return;
    const holder = document.createElement('template');
    holder.innerHTML = placeholderHTML(img.dataset.icon);
    img.replaceWith(holder.content.firstElementChild);
  }, true);
}
