# Progresso

Atualizado em 2026-11-23.

## Resumo

A estrutura do site está completa e testada: 15 páginas, 13 catálogos, modal, busca, histórico, página dos criadores e identidade visual nova. **O conteúdo real ainda não existe**: só há 5 itens de demonstração e nenhuma imagem real. A coleta de dados depende da sondagem da API, que o proprietário ainda não executou.

## Funcionalidades concluídas

- Cabeçalho com logotipo, navegação, submenu "Explorar", campo de busca e acesso ao histórico (menu recolhido em telas até 899 px).
- Home com hero (imagem de fundo substituível), 6 grupos temáticos de categorias mais "Diversos" e conteúdos em destaque por id.
- 13 páginas de catálogo (grade de miniaturas, agrupamento próprio e filtro), além de Sobre e Criadores.
- Ficha em modal reutilizável: foco, ESC, bloqueio da rolagem, relacionados nos dois sentidos, Voltar e link direto por `#id`.
- Busca global sem acentos nem maiúsculas, separada por categoria.
- Histórico no LocalStorage (20 entradas, sem duplicar consecutivas).
- Imagem de reserva para arquivos ausentes, skip-link, foco visível, `prefers-reduced-motion` e `<dialog>` nativo.
- Posicionamento correto de âncoras ao clicar e ao abrir a URL diretamente.
- Ferramenta de sondagem da API (`tools/sondagem.html`).
- Rastreabilidade em `docs/fontes/` e registro de decisões.

## Histórico

1. **Missão 01:** página inicial (Bootstrap, azul e dourado).
2. **Missão 02:** 11 páginas internas e sistema de categorias.
3. **Rastreabilidade (docs/fontes):** registro de fontes, pendências e decisões. A conversa de WhatsApp analisada foi depois considerada não confiável e seus documentos viraram históricos.
4. **Sondagem da API:** ferramenta criada. Ainda não executada pelo proprietário.
5. **Reforma de 2026-11-21 (novo prompt-mestre):** identidade em preto, cinza e branco, 13 categorias em grupos, modal, busca, histórico, criadores e remoção do Bootstrap.
6. **Auditoria de 2026-11-23** e correções 1 a 5, hero compacto (proposta A) e correção das âncoras.

## Arquivos

Em relação à última versão entregue em pacotes (Missão 02 mais a sondagem): **21 criados, 38 modificados, 0 removidos**. O projeto final tem 85 arquivos, sem `docs/legado`.

Criados (além de 12 marcadores `.gitkeep` nas pastas de imagens):

```
assets/images/backgrounds/hero.jpg
assets/svg/ornament.svg
data/content/mapas.json
data/content/modos-dlcs.json
data/content/npcs.json
data/creators.json
data/groups.json
docs/fontes/originais/chat.md
docs/fontes/registro-api.csv
docs/fontes/registro-fontes.csv
js/anchor.js
js/creators.js
js/history.js
js/modal.js
js/search.js
js/site.js
js/tile.js
pages/criadores.html
pages/mapas.html
pages/modos-dlcs.html
pages/npcs.html
```

Modificados:

```
css/base.css
css/components.css
css/pages.css
css/variables.css
data/categories.json
data/content/amuletos.json
data/content/bestiario.json
data/content/chefes.json
data/content/conquistas.json
data/content/guias.json
data/content/habilidades.json
data/content/itens.json
data/content/lore.json
data/content/personagens.json
data/content/regioes.json
data/featured.json
docs/fontes/decisoes.md
index.html
js/category.js
js/components.js
js/data.js
js/icons.js
js/main.js
js/navbar.js
js/page.js
js/render.js
js/utils.js
pages/amuletos.html
pages/bestiario.html
pages/chefes.html
pages/conquistas.html
pages/guias.html
pages/habilidades.html
pages/itens.html
pages/lore.html
pages/personagens.html
pages/regioes.html
pages/sobre.html
```

## Testes realizados

Em Chromium headless, servindo o projeto localmente e **sem internet** (fontes e API reais não foram alcançadas):

| Verificação | Resultado |
|---|---|
| Arquivos esperados, JSON, imports/exports, referências, ids de HTML, `alt` e variáveis CSS | 76 esperados presentes; 17 JSON válidos; 0 problemas em todos |
| 16 páginas em 1920, 1366, 768 e 375 px | 64 cargas, 0 erros de console, 0 respostas 404 locais, 0 rolagem horizontal |
| Suíte funcional (modal, busca, histórico, menus, acessibilidade básica e sondagem sem rede) | 46 de 46 |
| Skip-link, rolagem em 5 cenários, contraste de bordas e placeholders, foco no cabeçalho | 19 de 19 e 12 de 12 |
| Hero em 6 tamanhos de janela e legibilidade do texto sobre a imagem | todos aprovados (hero de 267 a 304 px; contraste de 4,6:1 a 13,1:1) |
| Âncoras clicadas e abertas pela URL | aprovadas; 2 casos de teste reclassificados (ver abaixo) |

**Não testado:** a API real, o Google Fonts, Firefox, Safari, aparelhos de toque, leitor de tela e listas com centenas de itens.

## Problemas encontrados e resolvidos

1. `normalize` não era exportado por `js/utils.js`: nenhuma página funcionava.
2. Faltavam os ícones `npcs`, `mapas` e `modos`.
3. O skip-link não aparecia ao receber foco.
4. Rolagem da página: o `scroll-padding-top` do `html` rolava a página ao focar controles do cabeçalho, e o foco devolvido ao modal podia rolar.
5. Contraste: bordas de controles em cerca de 2,5:1 (agora 3,6:1 a 4,1:1) e placeholder do filtro em 3,9:1 (agora 7,5:1).
6. Hero ocupava cerca de 60% da altura da janela (agora 26% a 47%).
7. Âncoras abertas pela URL paravam antes da seção.

Falhas dos **testes** (não do produto), já corrigidas: comando de encerramento que matava o próprio shell, critério de foco do modal e de rolagem rígidos demais, rolagem suave interferindo na medição, recarregar a página junto com o ESC e janelas altas em que a página já estava no limite de rolagem.

## Problemas e limitações remanescentes

1. Sem dados reais nem imagens reais; sondagem da API não executada.
2. Licença do `hero.jpg` por verificar; falta `docs/fontes/registro-imagens.csv`. A imagem tem 1200×675 e fica suave em telas grandes.
3. Falta o validador de dados (`tools/validar.html`).
4. A captura da página de Chefes da Fandom nunca foi recebida; o agrupamento por família depende de dados reais.
5. `js/hero.js` é código legado sem uso.
6. Não há repositório Git no ambiente de trabalho: o commit é feito pelo proprietário.

## Próximas tarefas

1. Executar a sondagem da API no navegador e enviar o relatório.
2. Definir e executar uma coleta controlada de dados verificados, sempre com URL e licença registradas.
3. Criar o validador de dados.
4. Organizar imagens e licenças e criar `registro-imagens.csv`.
5. Preencher criadores (fotos, nomes e textos) e os textos de Lore, Guias e Sobre.
6. Revisão de acessibilidade com leitor de tela e testes em outros navegadores.
7. Remover os itens de demonstração somente com autorização, depois de integrar dados reais.
