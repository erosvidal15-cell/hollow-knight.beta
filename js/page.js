// Ponto de entrada das páginas internas (pages/*.html). Cada módulo específico só age se encontrar seu elemento.
import { boot } from './boot.js';
import { commonModules } from './site.js';
import { initCategoryPage } from './category.js';
import { initCreators } from './creators.js';
import { initAnchor } from './anchor.js';

boot([...commonModules, ['catálogo', initCategoryPage], ['criadores', initCreators], ['âncora', initAnchor]]);
