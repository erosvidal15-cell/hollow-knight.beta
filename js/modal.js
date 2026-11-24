// MODAL reutilizável de ficha (um só componente para todas as categorias), baseado no <dialog> nativo:
// ESC, bloqueio do fundo e foco preso dentro do modal já vêm do navegador.
import { getCatalog, relatedOf } from './data.js';
import { escapeHTML, withRoot, root } from './utils.js';
import { placeholderHTML } from './tile.js';
import { recordView } from './history.js';
import { showToast } from './pending.js';

let dialog, opener = null, stack = [], currentId = '';

export function modalHTML(item, cat, canGoBack = false) {
  const category = cat.byCategory[item.category], content = cat.content[item.category];
  const groupLabel = content.groups.find((g) => g.id === item.group)?.label;
  const main = item.image
    ? `<img src="${escapeHTML(withRoot(item.image))}" alt="${escapeHTML(item.imageAlt ?? item.name)}" decoding="async" data-icon="${escapeHTML(category.icon)}">`
    : placeholderHTML(category.icon);
  const gallery = (item.images ?? []).map((i) => `<img src="${escapeHTML(withRoot(i.src))}" alt="${escapeHTML(i.alt ?? '')}" loading="lazy" data-icon="${escapeHTML(category.icon)}">`).join('');
  // Só aparece o que existe: nenhum campo vazio é preenchido com texto inventado
  const rows = [
    ...(item.location && !content.fields.some((f) => f.key === 'location') ? [{ label: 'Localização', value: item.location }] : []),
    ...content.fields.filter((f) => item[f.key]).map((f) => ({ label: f.label, value: item[f.key] })),
  ];
  const info = (item.info ?? []).map((t) => `<li>${escapeHTML(t)}</li>`).join('');
  const related = relatedOf(cat, item);
  const relHTML = cat.categories.map((c) => ({ c, list: related.filter((r) => r.category === c.id) })).filter((x) => x.list.length)
    .map(({ c, list }) => `<p class="hk-modal__relcat">${escapeHTML(c.title)}</p><ul class="chips">${list.map((r) => `<li><button type="button" class="chip" data-open="${escapeHTML(r.id)}">${escapeHTML(r.name)}</button></li>`).join('')}</ul>`).join('');
  const sources = (item.sources ?? []).filter((s) => /^https?:\/\//.test(s.url ?? ''))
    .map((s) => `<li><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.label ?? s.url)}</a></li>`).join('');
  const empty = !item.description && !rows.length && !info;
  return `
    <header class="hk-modal__head">
      <div><p class="hk-modal__kicker">${escapeHTML(category.title)}${groupLabel ? ` / ${escapeHTML(groupLabel)}` : ''}${item.demo ? ' (demonstração)' : ''}</p>
      <h2 class="hk-modal__title" id="modal-title" tabindex="-1">${escapeHTML(item.name)}</h2></div>
      <div class="hk-modal__actions">${canGoBack ? '<button type="button" class="btn btn--small" data-back>Voltar</button>' : ''}<button type="button" class="icon-btn" data-close aria-label="Fechar"><svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    </header>
    <img class="ornament" src="${root()}assets/svg/ornament.svg" alt="" width="300" height="24">
    <div class="hk-modal__body">
      <figure class="hk-modal__media" style="margin:0">${main}${gallery ? `<div class="hk-modal__gallery">${gallery}</div>` : ''}</figure>
      <div class="hk-modal__info">
        ${item.description ? `<p>${escapeHTML(item.description)}</p>` : ''}
        ${rows.length ? `<dl class="fields">${rows.map((r) => `<div><dt>${escapeHTML(r.label)}</dt><dd>${escapeHTML(r.value)}</dd></div>`).join('')}</dl>` : ''}
        ${info ? `<h3>Informações</h3><ul class="plain">${info}</ul>` : ''}
        ${empty ? '<p class="muted">Informações detalhadas ainda não cadastradas.</p>' : ''}
        ${relHTML ? `<h3>Relacionados</h3>${relHTML}` : ''}
        ${sources ? `<h3>Fontes</h3><ul class="plain">${sources}</ul>` : ''}
      </div>
    </div>`;
}

export async function openItem(id, { opener: from = null, back = false } = {}) {
  let cat;
  try { cat = await getCatalog(); } catch { showToast('Não foi possível carregar os conteúdos.'); return false; }
  const item = cat.index.get(id);
  if (!item) { showToast('Conteúdo não encontrado.'); return false; }
  document.getElementById('history-panel')?.close();
  if (!back) { if (!dialog.open) stack = []; stack.push(id); }
  currentId = id;
  dialog.querySelector('.hk-modal__card').innerHTML = modalHTML(item, cat, stack.length > 1);
  if (!dialog.open) {
    opener = from ?? document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add('modal-open');
  }
  try { history.replaceState(null, '', `${location.pathname}${location.search}#${id}`); } catch { /* ignora */ }
  recordView(item, cat.byCategory[item.category]);
  dialog.querySelector('.hk-modal__title').focus({ preventScroll: true });
  dialog.querySelector('.hk-modal__body').scrollTop = 0;
  return true;
}

function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id === currentId) return;
  getCatalog().then((cat) => { if (cat.index.has(id)) openItem(id); }).catch(() => {});
}

export function initModal() {
  dialog = document.createElement('dialog');
  dialog.className = 'hk-modal'; dialog.id = 'item-modal'; dialog.setAttribute('aria-labelledby', 'modal-title');
  dialog.innerHTML = '<article class="hk-modal__card"></article>';
  document.body.append(dialog);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();       // clique no fundo escuro também fecha
    else if (e.target.closest('[data-back]')) { stack.pop(); openItem(stack.at(-1), { back: true }); }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');
    stack = []; currentId = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch { /* ignora */ }
    if (opener?.isConnected) opener.focus({ preventScroll: true });  // preventScroll: devolver o foco não pode rolar a página                                           // devolve o foco a quem abriu
    opener = null;
  });
  // Delegação: qualquer elemento com data-open="id" (miniatura, resultado de busca, histórico, relacionado) abre a ficha
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-open]');
    if (!target) return;
    e.preventDefault();
    openItem(target.dataset.open, { opener: target });
  });
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}
