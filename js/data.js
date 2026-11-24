// CARREGAMENTO DE DADOS: único módulo que sabe de onde os dados vêm (hoje, arquivos JSON locais).
// getCatalog() junta todas as categorias em um índice por id, usado por catálogo, modal, busca e histórico.
import { withRoot } from './utils.js';

export async function loadJSON(path) {
  const url = withRoot(path);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} respondeu HTTP ${response.status}`);
  return response.json();
}

let categories, groups, catalog; // guardamos as Promises: cada arquivo é baixado uma vez
export const getCategories = () => (categories ??= loadJSON('data/categories.json'));
export const getGroups = () => (groups ??= loadJSON('data/groups.json'));
export const getCategoryContent = (id) => loadJSON(`data/content/${id}.json`);
export const getCatalog = () => (catalog ??= buildCatalog());

async function buildCatalog() {
  const cats = await getCategories();
  // allSettled: se um arquivo falhar, as outras categorias continuam funcionando
  const results = await Promise.allSettled(cats.map((c) => getCategoryContent(c.id)));
  const content = {}, errors = [], index = new Map(), backlinks = new Map();
  cats.forEach((c, i) => {
    const r = results[i];
    if (r.status !== 'fulfilled') {
      errors.push({ category: c.id, message: String(r.reason?.message ?? r.reason) });
      content[c.id] = { fields: [], groups: [], items: [] };
      return;
    }
    const { fields = [], groups: g = [], items = [] } = r.value;
    content[c.id] = { fields, groups: g, items };
    for (const item of items) {
      item.category = c.id; // a categoria vem do arquivo, não precisa ser repetida no JSON
      if (index.has(item.id)) { errors.push({ category: c.id, message: `id duplicado: ${item.id}` }); continue; }
      index.set(item.id, item);
      for (const target of item.related ?? []) (backlinks.get(target) ?? backlinks.set(target, []).get(target)).push(item.id);
    }
  });
  return { categories: cats, byCategory: Object.fromEntries(cats.map((c) => [c.id, c])), content, index, backlinks, errors };
}

// Conteúdos ligados a um item: os que ele cita em "related" + os que citam ele (a relação é escrita uma vez só)
export function relatedOf(cat, item) {
  const ids = new Set([...(item.related ?? []), ...(cat.backlinks.get(item.id) ?? [])]);
  ids.delete(item.id);
  return [...ids].map((id) => cat.index.get(id)).filter(Boolean);
}
