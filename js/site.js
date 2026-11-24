// Módulos comuns a TODAS as páginas, na ordem em que precisam iniciar.
import { initComponents } from './components.js';
import { initNavbar } from './navbar.js';
import { initImageFallback } from './tile.js';
import { initModal } from './modal.js';
import { initHistory } from './history.js';
import { initSearch } from './search.js';
import { initPendingLinks } from './pending.js';

export const commonModules = [
  ['componentes', initComponents],   // 1º: cria cabeçalho e rodapé
  ['navbar', initNavbar],            // depende do cabeçalho criado
  ['imagens', initImageFallback],
  ['modal', initModal],
  ['histórico', initHistory],        // depende do botão do cabeçalho
  ['busca', initSearch],             // depende do campo do cabeçalho
  ['links pendentes', initPendingLinks],
];
