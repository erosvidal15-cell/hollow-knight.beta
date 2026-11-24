// HISTÓRICO de visualização, guardado no LocalStorage (somente neste navegador).
import { escapeHTML, withRoot } from './utils.js';
import { placeholderHTML } from './tile.js';

const KEY = 'hkwiki.historico.v1';
const LIMIT = 20;
const store = () => { try { return globalThis.localStorage ?? null; } catch { return null; } }; // pode lançar erro se bloqueado

export function readHistory(storage = store()) {
  try {
    const list = JSON.parse(storage?.getItem(KEY) ?? '[]');
    return Array.isArray(list) ? list.filter((e) => e && typeof e.id === 'string' && typeof e.name === 'string') : [];
  } catch { return []; }
}
export function writeHistory(list, storage = store()) { try { storage?.setItem(KEY, JSON.stringify(list)); } catch { /* cota cheia ou bloqueado: ignora */ } }

// Regra pura (testável): mais recente primeiro, sem duplicar visualizações consecutivas, com limite
export function addEntry(list, entry, limit = LIMIT) {
  const next = list[0]?.id === entry.id ? [entry, ...list.slice(1)] : [entry, ...list];
  return next.slice(0, limit);
}
export function recordView(item, category) {
  writeHistory(addEntry(readHistory(), { id: item.id, name: item.name, category: item.category, categoryTitle: category?.title ?? '', icon: category?.icon ?? '', image: item.image ?? '', t: Date.now() }));
}

function listHTML(list) {
  if (!list.length) return '<p class="hk-empty">Nenhum conteúdo visualizado ainda.</p>';
  return `<ul class="hk-panel__list">${list.map((e) => `<li><button type="button" class="hist" data-open="${escapeHTML(e.id)}"><span class="hist__thumb">${e.image ? `<img src="${escapeHTML(withRoot(e.image))}" alt="" loading="lazy" data-icon="${escapeHTML(e.icon ?? '')}">` : placeholderHTML(e.icon ?? '')}</span><span><span class="hist__name">${escapeHTML(e.name)}</span><span class="hist__cat">${escapeHTML(e.categoryTitle ?? '')}</span></span></button></li>`).join('')}</ul>`;
}

export function initHistory() {
  const button = document.getElementById('history-open');
  if (!button) return;
  const panel = document.createElement('dialog');
  panel.className = 'hk-panel'; panel.id = 'history-panel'; panel.setAttribute('aria-labelledby', 'history-title');
  panel.innerHTML = `<div class="hk-panel__head"><h2 id="history-title">Histórico</h2><span><button type="button" class="btn btn--small" data-clear>Limpar</button> <button type="button" class="icon-btn" data-close aria-label="Fechar histórico"><svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span></div><div class="hk-panel__body" id="history-body"></div>`;
  document.body.append(panel);
  const body = panel.querySelector('#history-body');
  const render = () => { body.innerHTML = listHTML(readHistory()); };
  button.addEventListener('click', () => { render(); panel.showModal(); document.documentElement.classList.add('modal-open'); });
  panel.addEventListener('click', (e) => {
    if (e.target === panel || e.target.closest('[data-close]')) panel.close();
    else if (e.target.closest('[data-clear]')) { writeHistory([]); render(); }
  });
  panel.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
}
