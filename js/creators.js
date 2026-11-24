// Página dos criadores: lê data/creators.json. Campos vazios mostram um espaço reservado, nunca texto inventado.
import { loadJSON } from './data.js';
import { escapeHTML, withRoot } from './utils.js';

export async function initCreators() {
  const box = document.getElementById('creators');
  if (!box) return;
  try {
    const list = await loadJSON('data/creators.json');
    box.innerHTML = list.map((c) => `
      <article class="creator${c.name || c.photo || c.bio ? '' : ' is-empty'}">
        <figure class="creator__photo">
          <div class="creator__frame">${c.photo ? `<img src="${escapeHTML(withRoot(c.photo))}" alt="${escapeHTML(c.photoAlt ?? '')}" loading="lazy">` : '<span>Fotografia a ser adicionada</span>'}</div>
          ${c.caption ? `<figcaption>${escapeHTML(c.caption)}</figcaption>` : ''}
        </figure>
        <h2>${c.name ? escapeHTML(c.name) : 'Nome a ser definido'}</h2>
        <p>${c.bio ? escapeHTML(c.bio) : 'Apresentação a ser escrita.'}</p>
      </article>`).join('');
  } catch (error) {
    console.error('[creators]', error);
    box.innerHTML = '<p class="hk-empty">Não foi possível carregar esta página.</p>';
  }
}
