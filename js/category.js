// CATÁLOGO das páginas de categoria: grade de miniaturas (imagem + nome), grupos próprios e filtro local.
// O clique abre o modal (modal.js) pelo atributo data-open, sem sair da página.
import { getCatalog } from './data.js';
import { tileHTML } from './tile.js';
import { escapeHTML, normalize, withRoot } from './utils.js';

const sectionHTML = (label, items, icon) => `<section class="catalog__group">${label ? `<h2 class="catalog__title">${escapeHTML(label)}</h2>` : ''}<ul class="tiles">${items.map((i) => tileHTML(i, icon)).join('')}</ul></section>`;

const emptyHTML = `<div class="empty-state"><img class="ornament" src="${withRoot('assets/svg/ornament.svg')}" alt="" width="300" height="24"><h2>Nenhum conteúdo cadastrado ainda</h2><p>Esta categoria receberá dados verificados na etapa de coleta.</p></div>`;

export async function initCategoryPage() {
  const mount = document.getElementById('catalog');
  if (!mount) return;
  const id = document.body.dataset.page, tools = document.getElementById('catalog-tools');
  mount.setAttribute('aria-busy', 'true');
  mount.innerHTML = '<p class="hk-empty">Carregando…</p>';
  try {
    const cat = await getCatalog();
    const failed = cat.errors.find((e) => e.category === id && !e.message.startsWith('id duplicado'));
    if (failed) throw new Error(failed.message);
    const category = cat.byCategory[id];
    if (!category) throw new Error(`a categoria "${id}" não existe em data/categories.json`);
    const { groups, items } = cat.content[id];
    if (!items.length) { mount.innerHTML = emptyHTML; tools.hidden = true; return; }
    const known = new Set(groups.map((g) => g.id)), sections = [];
    for (const g of groups) { const list = items.filter((i) => i.group === g.id); if (list.length) sections.push(sectionHTML(g.label, list, category.icon)); }
    const rest = items.filter((i) => !known.has(i.group));
    if (rest.length) sections.push(sectionHTML(groups.length ? 'Outros' : '', rest, category.icon));
    mount.innerHTML = sections.join('');
    setupFilter(mount, items.length);
  } catch (error) {
    console.error(`[category] ${id}:`, error);
    mount.innerHTML = '<p class="hk-empty">Não foi possível carregar este conteúdo. Abra o site por um servidor (por exemplo, o Live Server) e recarregue a página.</p>';
    if (tools) tools.hidden = true;
  } finally { mount.removeAttribute('aria-busy'); }
}

// O filtro só esconde/mostra miniaturas já na página: abrir e fechar o modal não o reinicia
function setupFilter(mount, total) {
  const input = document.getElementById('catalog-filter'), status = document.getElementById('catalog-status');
  const rows = [...mount.querySelectorAll('.tiles li')].map((li) => ({ li, name: normalize(li.textContent) }));
  input.addEventListener('input', () => {
    const q = normalize(input.value);
    let shown = 0;
    for (const r of rows) { r.li.hidden = !r.name.includes(q); if (!r.li.hidden) shown++; }
    for (const g of mount.querySelectorAll('.catalog__group')) g.hidden = ![...g.querySelectorAll('li')].some((li) => !li.hidden);
    status.textContent = q ? (shown ? `${shown} de ${total} conteúdos` : 'Nenhum conteúdo encontrado') : '';
  });
}
