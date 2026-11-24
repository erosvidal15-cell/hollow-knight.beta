// COMPONENTES COMPARTILHADOS: cabeçalho e rodapé são escritos aqui UMA vez e injetados em todas as páginas.
import { getCategories, getGroups } from './data.js';
import { root, escapeHTML } from './utils.js';

async function loadNav() {
  try { return { categories: await getCategories(), groups: await getGroups() }; }
  catch (error) { console.error('[components] navegação:', error); return { categories: [], groups: [] }; }
}

function exploreHTML({ categories, groups }, page) {
  const r = root();
  return groups.map((g) => {
    const links = [...categories.filter((c) => c.group === g.id), ...(g.pages ?? [])];
    return `<div><h3>${escapeHTML(g.label)}</h3><ul>${links.map((l) => {
      const id = l.id ?? l.href.match(/pages\/(.+)\.html/)?.[1];
      return `<li><a href="${r}${escapeHTML(l.href)}"${id === page ? ' aria-current="page"' : ''}>${escapeHTML(l.title)}</a></li>`;
    }).join('')}</ul></div>`;
  }).join('');
}

function headerHTML(nav, page) {
  const r = root(), home = `${r}index.html`;
  return `
  <header class="site-header">
    <div class="container site-header__bar">
      <a class="brand" href="${home}"><img src="${r}assets/svg/favicon.svg" alt="" width="24" height="24"><span>Arquivos de Hallownest</span></a>
      <button type="button" class="icon-btn menu-toggle" aria-expanded="false" aria-controls="site-menu" aria-label="Abrir menu"><svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <div class="site-header__menu" id="site-menu">
        <nav class="site-nav" aria-label="Principal">
          <a href="${home}"${page === 'home' ? ' aria-current="page"' : ''}>Início</a>
          <details class="explore"><summary>Explorar</summary><div class="explore__panel">${exploreHTML(nav, page)}</div></details>
        </nav>
        <form class="search" role="search">
          <label class="visually-hidden" for="site-search">Buscar na wiki</label>
          <input type="search" id="site-search" placeholder="Buscar na wiki" autocomplete="off" aria-controls="search-results">
          <div class="search__panel" id="search-results" hidden></div>
          <p class="visually-hidden" id="search-status" role="status"></p>
        </form>
        <button type="button" class="history-btn" id="history-open"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Histórico</button>
      </div>
    </div>
  </header>`;
}

function footerHTML() {
  const r = root();
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand">Arquivos de Hallownest</p>
          <p>Projeto de fãs, não oficial. Hollow Knight é uma criação da Team Cherry. Imagens e textos de terceiros são creditados na ficha de cada conteúdo, quando aplicável, e o conteúdo da comunidade será creditado quando for integrado.</p>
        </div>
        <div><h2>Navegar</h2><ul>
          <li><a href="${r}index.html">Início</a></li>
          <li><a href="${r}index.html#categorias">Categorias</a></li>
          <li><a href="${r}index.html#destaques">Em destaque</a></li>
        </ul></div>
        <div><h2>A wiki</h2><ul>
          <li><a href="${r}pages/sobre.html">Sobre</a></li>
          <li><a href="${r}pages/criadores.html">Criadores</a></li>
          <li><a href="${r}pages/modos-dlcs.html">Modos e DLCs</a></li>
        </ul></div>
      </div>
      <p class="site-footer__copy">© ${new Date().getFullYear()} Arquivos de Hallownest</p>
    </div>
  </footer>`;
}

export async function initComponents() {
  const page = document.body.dataset.page;
  const header = document.getElementById('site-header'), footer = document.getElementById('site-footer');
  if (header) header.outerHTML = headerHTML(await loadNav(), page);
  if (footer) footer.outerHTML = footerHTML();
}
