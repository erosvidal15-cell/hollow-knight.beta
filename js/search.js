// BUSCA GLOBAL: procura em todos os JSON (nome, termos relacionados, categoria e conteúdos ligados).
import { getCatalog, relatedOf } from './data.js';
import { ICONS } from './icons.js';
import { escapeHTML, normalize, withRoot } from './utils.js';
import { placeholderHTML } from './tile.js';

// Função pura (testável fora do navegador): recebe o catálogo e o texto digitado.
export function searchCatalog(cat, query, { perCategory = 8 } = {}) {
  const q = normalize(query);
  if (!q) return { total: 0, groups: [] };
  const tokens = q.split(' ');
  const hits = new Map();
  const matchesCategory = (c) => q.length >= 2 && (normalize(c.title).startsWith(q) || normalize(c.id).startsWith(q));
  for (const item of cat.index.values()) {
    const name = normalize(item.name), aliases = (item.aliases ?? []).map(normalize);
    let score = 0, via = '';
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.split(' ').some((w) => w.startsWith(q))) score = 60;
    else if (name.includes(q)) score = 40;
    else if (aliases.some((a) => a.includes(q))) { score = 30; via = 'termo relacionado'; }
    else if (tokens.length > 1 && tokens.every((t) => name.includes(t) || aliases.some((a) => a.includes(t)))) score = 25;
    if (!score && matchesCategory(cat.byCategory[item.category])) { score = 10; via = 'categoria'; }
    if (score) hits.set(item.id, { item, score, via });
  }
  // Conteúdos ligados a um resultado forte também aparecem (ex.: chefes encontrados em uma região buscada)
  const strong = new Set([...hits.values()].filter((h) => h.score >= 60).map((h) => h.item.id));
  if (strong.size) for (const item of cat.index.values()) {
    if (hits.has(item.id)) continue;
    const near = relatedOf(cat, item).find((r) => strong.has(r.id));
    if (near) hits.set(item.id, { item, score: 5, via: `relacionado a ${near.name}` });
  }
  const groups = cat.categories.map((category) => {
    const list = [...hits.values()].filter((h) => h.item.category === category.id)
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, 'pt'));
    return { category, hits: list.slice(0, perCategory), count: list.length };
  }).filter((g) => g.count);
  return { total: hits.size, groups };
}

const resultsHTML = (res) => res.groups.map((g) => `
  <section class="search__group"><h3>${escapeHTML(g.category.title)} (${g.count})</h3><ul>${g.hits.map(({ item, via }) => `
    <li><button type="button" class="search__hit" data-open="${escapeHTML(item.id)}">
      <span class="search__thumb">${item.image ? `<img src="${escapeHTML(withRoot(item.image))}" alt="" loading="lazy" data-icon="${escapeHTML(g.category.icon)}">` : placeholderHTML(g.category.icon)}</span>
      <span>${escapeHTML(item.name)}</span><span class="search__via">${escapeHTML(item.demo ? 'demonstração' : via)}</span></button></li>`).join('')}</ul></section>`).join('');

export function initSearch() {
  const input = document.getElementById('site-search'), panel = document.getElementById('search-results'), status = document.getElementById('search-status');
  if (!input || !panel) return;
  let timer;
  const hide = () => { panel.hidden = true; };
  const show = (html, message) => { panel.innerHTML = html; panel.hidden = false; status.textContent = message; };
  async function run() {
    if (!normalize(input.value)) { hide(); status.textContent = ''; return; }
    let cat;
    try { cat = await getCatalog(); } catch { show('<p class="search__msg">Não foi possível carregar os conteúdos.</p>', 'Erro ao carregar'); return; }
    const res = searchCatalog(cat, input.value);
    if (res.total) show(resultsHTML(res), `${res.total} resultado(s)`);
    else show(`<p class="search__msg">${cat.index.size ? `Nenhum resultado para “${escapeHTML(input.value.trim())}”.` : 'Ainda não há conteúdos cadastrados para buscar.'}</p>`, 'Nenhum resultado');
  }
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
  input.addEventListener('focus', () => { getCatalog().catch(() => {}); if (normalize(input.value)) run(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
    else if (e.key === 'Enter') { e.preventDefault(); clearTimeout(timer); run().then(() => panel.querySelector('[data-open]')?.click()); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); panel.querySelector('[data-open]')?.focus(); }
  });
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hide(); input.focus(); } });
  panel.addEventListener('click', (e) => { if (e.target.closest('[data-open]')) hide(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) hide(); });
  input.form?.addEventListener('submit', (e) => e.preventDefault());
}
