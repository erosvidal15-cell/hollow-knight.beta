// Desenha a home: categorias em grupos temáticos e conteúdos em destaque (por id).
import { ICONS } from './icons.js';
import { getCatalog, getCategories, getGroups, loadJSON } from './data.js';
import { escapeHTML, withRoot } from './utils.js';
import { tileHTML } from './tile.js';

const linkHTML = (l) => `<li><a class="group__link" href="${escapeHTML(withRoot(l.href))}"><svg class="group__icon icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[l.icon] ?? ICONS.lore}</svg><span><span class="group__name">${escapeHTML(l.title)}</span><span class="group__text">${escapeHTML(l.text ?? '')}</span></span></a></li>`;

async function renderGroups() {
  const box = document.getElementById('groups-grid');
  if (!box) return;
  try {
    const [categories, groups] = await Promise.all([getCategories(), getGroups()]);
    box.innerHTML = groups.map((g) => `<section class="group" aria-labelledby="g-${escapeHTML(g.id)}"><h3 class="group__title" id="g-${escapeHTML(g.id)}">${escapeHTML(g.label)}</h3><ul class="group__list">${[...categories.filter((c) => c.group === g.id), ...(g.pages ?? [])].map(linkHTML).join('')}</ul></section>`).join('');
  } catch (error) {
    console.error('[render] categorias:', error);
    box.innerHTML = '<p class="hk-empty">Não foi possível carregar as categorias. Abra o site por um servidor (por exemplo, o Live Server) e recarregue a página.</p>';
  }
}

async function renderFeatured() {
  const box = document.getElementById('featured');
  if (!box) return;
  try {
    const [cat, featured] = await Promise.all([getCatalog(), loadJSON('data/featured.json')]);
    const items = (featured.items ?? []).map((id) => cat.index.get(id)).filter(Boolean); // id inexistente é ignorado
    box.innerHTML = items.length
      ? `<ul class="tiles">${items.map((i) => tileHTML(i, cat.byCategory[i.category].icon)).join('')}</ul>`
      : '<p class="hk-empty">Os destaques aparecerão aqui quando houver conteúdos selecionados.</p>';
  } catch (error) {
    console.error('[render] destaques:', error);
    box.innerHTML = '<p class="hk-empty">Não foi possível carregar os destaques.</p>';
  }
}

export const initContent = () => Promise.all([renderGroups(), renderFeatured()]);
