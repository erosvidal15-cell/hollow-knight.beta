// Ponto de entrada da página inicial. (hero.js não é mais iniciado: a direção visual atual dispensa partículas e parallax.)
import { boot } from './boot.js';
import { commonModules } from './site.js';
import { initContent } from './render.js';
import { initAnchor } from './anchor.js';

boot([...commonModules, ['conteúdo', initContent], ['âncora', initAnchor]]);
