// Funções pequenas usadas por vários módulos.

// Cada página declara onde fica a raiz do projeto: <body data-root=""> (index) ou data-root="../" (pages/)
export const root = () => document.body.dataset.root ?? '';

// Transforma "pages/amuletos.html" no caminho correto a partir da página atual.
// Links externos, absolutos e âncoras (#x) passam sem alteração.
export const withRoot = (path) => (/^(https?:|\/|#)/.test(path) ? path : root() + path);

// Impede que texto vindo de dados vire HTML (importante quando os dados vierem da API)
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

// Texto de busca: sem acentos, minúsculas e espaços normalizados ("  HÓrnet " -> "hornet")
export const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
