# Arquivos de Hallownest: wiki de fãs sobre Hollow Knight

Projeto não oficial. Hollow Knight é uma criação da Team Cherry. Site estático, em português, sem etapa de build.

## Objetivo

Reunir, em um só lugar, fichas verificáveis sobre chefes, bestiário, amuletos, NPCs, personagens, regiões, mapas, itens, habilidades, conquistas, lore, guias, modos de jogo e DLCs. A navegação é por categorias, com busca global, fichas em modal, histórico de visualização e página dos criadores.

**Regra central: não inventar dados.** O que não foi confirmado fica vazio ou marcado como demonstração.

## Estado atual

A estrutura, os catálogos, o modal, a busca, o histórico e a navegação estão prontos e testados. **O conteúdo real ainda não foi cadastrado**: existem 5 itens de demonstração (ids começando com `exemplo-` e campo `demo: true`), e as demais categorias aparecem vazias, com uma mensagem honesta. Veja `PROGRESSO.md` para o que falta.

## Tecnologias

- HTML5, CSS3, JavaScript puro (módulos ES) e JSON.
- LocalStorage, apenas para o histórico de visualização.
- **Sem Bootstrap, sem frameworks, sem Node e sem build no projeto.** O Bootstrap foi removido na reforma de 2026-11-21: só servia para grade e barra de navegação, e o site não deve depender de rede para exibir conteúdo.
- Único recurso externo: Google Fonts (Cormorant SC, Cormorant Garamond e Inter). Sem rede, o navegador usa Georgia e as fontes do sistema.

## Como executar

Abra a pasta no VS Code e rode `index.html` com a extensão **Live Server**. Não abra o arquivo com duplo clique: módulos ES e `fetch()` só funcionam por HTTP.

## Estrutura de pastas

```
index.html                   página inicial
pages/                       15 páginas: 13 catálogos, sobre.html e criadores.html (mesmo modelo)
css/
  variables.css              tokens visuais: cores, fontes, medidas e imagem do hero
  base.css                   reset, tipografia, botões, foco, skip-link e movimento reduzido
  components.css             cabeçalho, hero, grupos, miniaturas, modal, histórico e rodapé
  pages.css                  páginas internas: cabeçalho da página, catálogo, texto e criadores
js/
  main.js, page.js           ENTRADAS (home e páginas internas)
  boot.js                    executa a lista de módulos, isolando falhas
  site.js                    módulos comuns a todas as páginas, na ordem de início
  components.js              cabeçalho e rodapé compartilhados
  navbar.js                  menu no celular e submenu "Explorar"
  data.js                    carregamento dos dados e índice de conteúdos (getCatalog)
  render.js                  home: grupos de categorias e destaques
  category.js                páginas de categoria: catálogo e filtro
  tile.js                    miniatura e imagem de reserva
  modal.js                   ficha em modal
  search.js                  busca global
  history.js                 histórico de visualização
  anchor.js                  posiciona âncoras no carregamento
  creators.js                página dos criadores
  pending.js                 aviso para links ainda sem página
  icons.js, utils.js         ícones e funções comuns
  hero.js                    LEGADO: partículas e parallax; mantido, mas não é iniciado
data/
  categories.json            as 13 categorias (id, ícone, título, texto, grupo, link)
  groups.json                os 6 grupos temáticos e o grupo "Diversos" (com Sobre e Criadores)
  featured.json              ids dos conteúdos em destaque na home
  creators.json              os dois criadores (nome, foto, legenda e apresentação)
  content/<categoria>.json   os 13 catálogos: campos, grupos e itens
assets/
  svg/                       favicon, ornament.svg (ornamento atual) e divider.svg (legado)
  images/                    backgrounds/hero.jpg; as demais pastas aguardam imagens (.gitkeep)
tools/
  sondagem.html, sondagem.js ferramenta de teste da API (não faz parte do site público)
docs/fontes/                 rastreabilidade: fontes, pendências, glossário e decisões
PROJETO.md, PROGRESSO.md
```

## Como a arquitetura funciona

**Entrada e inicialização.** Cada página carrega uma entrada: `js/main.js` na home e `js/page.js` nas internas. Ambas chamam `boot()` com uma lista de módulos. Cada módulo roda dentro de um `try/catch`, então a falha de um não derruba os outros.

**Ordem de início** (`js/site.js`, comum a todas as páginas): componentes (cria cabeçalho e rodapé) → navbar → imagens → modal → histórico → busca → links pendentes. Depois vêm os módulos de cada tipo de página: na home, `render.js`; nas internas, `category.js` e `creators.js`. O último é sempre `anchor.js`.

**Caminhos.** Cada `<body>` declara `data-page` e `data-root` (`""` na home e `"../"` em `pages/`). `withRoot()` (`js/utils.js`) usa isso para montar qualquer link, imagem ou arquivo de dados a partir de qualquer pasta.

**Dados.** `js/data.js` é o único ponto que sabe de onde os dados vêm. `getCatalog()` baixa `categories.json` e os 13 arquivos de `content/` em paralelo (`Promise.allSettled`), monta um índice por id e as relações reversas. Se um arquivo falhar, as outras categorias continuam funcionando. Quando a coleta pela API existir, ela deve alimentar esses mesmos JSON, e o site continua estático.

**Catálogo.** Cada página de categoria mostra uma grade de miniaturas (imagem e nome), agrupada pelos `groups` do arquivo de conteúdo e com um filtro local. Categorias sem itens mostram um estado vazio.

**Modal.** Usa o `<dialog>` nativo. Qualquer elemento com `data-open="id"` (miniatura, resultado de busca, item do histórico ou relacionado) abre a ficha, sem sair da página. Fecha com ESC, botão ou clique no fundo, bloqueia a rolagem do fundo, devolve o foco a quem o abriu e preserva a posição da página. A URL recebe `#id`, e abrir uma página com `#id` já abre a ficha. Os relacionados aparecem nos dois sentidos, e há um botão Voltar.

**Busca.** `searchCatalog()` (`js/search.js`) ignora maiúsculas, acentos e espaços extras. Procura em nome, termos relacionados (`aliases`), categoria e conteúdos ligados, e separa os resultados por categoria (até 8 por categoria). Quando não há dado, mostra "Nenhum resultado" e nunca inventa resultados.

**Histórico.** Guardado no LocalStorage (chave `hkwiki.historico.v1`), com até 20 entradas, a mais recente primeiro e sem duplicar visualizações consecutivas. O botão "Histórico" no cabeçalho abre o painel. Não há favoritos.

**Âncoras.** O navegador salta para `#categorias` antes de o JavaScript montar a página. `js/anchor.js` reposiciona uma vez, depois da montagem, exceto se o visitante já interagiu.

**Imagens.** Imagem ausente ou quebrada vira um ícone de reserva (`js/tile.js`). Nas miniaturas o `alt` é vazio porque o nome aparece logo abaixo. No modal a imagem recebe `alt` descritivo.

## Modelo de dados

`data/categories.json`: lista com `id`, `icon`, `title`, `text`, `group`, `href` e `status`.

`data/groups.json`: lista com `id` e `label`. O grupo `diversos` também tem `pages` (Sobre e Criadores).

`data/content/<id>.json`:

```
{
  "fields": [ { "key": "...", "label": "..." } ],   campos extras exibidos na ficha
  "groups": [ { "id": "...", "label": "..." } ],   agrupamento do catálogo (pode ser vazio)
  "items":  [ ... ]
}
```

Campos de um item:

| Campo | Obrigatório | Uso |
|---|---|---|
| `id` | sim | único em TODO o site; minúsculo, sem acento, hifenizado; nunca muda depois de publicado |
| `name` | sim | nome exibido |
| `aliases` | não | lista de termos extras para a busca |
| `description` | não | texto da ficha |
| `image`, `imageAlt` | não | caminho a partir da raiz (por exemplo `assets/images/bosses/arquivo.png`) e texto alternativo |
| `images` | não | lista de `{ "src": "...", "alt": "..." }` (galeria da ficha) |
| `location` | não | localização (se a categoria declarar `location` em `fields`, ele aparece pelo `fields`) |
| `info` | não | lista de textos curtos |
| `sources` | não | lista de `{ "label": "...", "url": "https://..." }` |
| `group` | não | `id` de um grupo declarado em `groups` do mesmo arquivo |
| `related` | não | lista de ids de outros itens do site |
| `demo` | não | `true` marca conteúdo de demonstração (selo "Demonstração") |
| qualquer `key` de `fields` | não | por exemplo efeito, custo ou recompensa; só aparece se existir |

A categoria **não** é escrita no item: vem do arquivo. A relação é escrita uma vez só: se o item A cita B em `related`, a ficha de B também mostra A.

## Como adicionar uma categoria

1. Em `data/categories.json`, acrescente `id`, `icon`, `title`, `text`, `group`, `href` (`pages/<id>.html`) e `status`. Se o ícone for novo, adicione-o em `js/icons.js`.
2. Crie `data/content/<id>.json` com `fields`, `groups` e `items`.
3. Copie uma página de catálogo de `pages/` (por exemplo `pages/chefes.html`) para `pages/<id>.html` e troque `data-page`, o `<title>`, a descrição, o `<h1>` e a trilha de navegação.

Menu "Explorar", home e busca atualizam sozinhos.

## Como adicionar conteúdo

Inclua um objeto em `items` do arquivo da categoria. Exemplo (valores genéricos, não são dados do jogo):

```json
{
  "id": "id-unico-do-item",
  "name": "Nome do item",
  "description": "Texto verificado, com a fonte registrada.",
  "image": "assets/images/bosses/nome-do-arquivo.png",
  "imageAlt": "Descrição curta da imagem",
  "group": "id-de-um-grupo-da-categoria",
  "related": ["id-de-outro-item"],
  "sources": [{ "label": "Nome da fonte", "url": "https://..." }]
}
```

Campos ausentes simplesmente não aparecem. **Só cadastre dados verificados** e registre a origem e a licença de cada imagem.

## Personalização visual

- Cores, fontes e medidas: `css/variables.css` (por exemplo `--hk-bg`, `--hk-text`, `--hk-control`, `--tile` e `--header-h`). O token `--hk-gold` é legado e não é usado.
- **Imagem de fundo da home:** substitua `assets/images/backgrounds/hero.jpg` ou altere `--hero-image` em `variables.css`. A altura do hero está na regra `.hero` de `css/components.css`.
- **Criadores:** edite `data/creators.json` (dois registros com `name`, `photo`, `photoAlt`, `caption` e `bio`). Fotos entram em `assets/images/creators/`. Campos vazios mostram um espaço reservado.

## Ferramentas

`tools/sondagem.html` testa a API MediaWiki da Hollow Knight Wiki (Fandom) a partir do **seu** navegador: acesso, CORS, módulos, paginação, imagens e metadados. Faz no máximo 20 requisições de leitura e não grava nada. Abra pelo Live Server, clique em "Executar sondagem" e copie o relatório. O validador de dados (`tools/validar.html`) está planejado e **ainda não existe**.

## Documentação e rastreabilidade

- `docs/fontes/decisoes.md`: decisões aprovadas e suas revisões.
- `docs/fontes/pendencias.md`, `glossario.md`, `duplicacoes.md` e `inventario.md`: **históricos**. Derivam de uma conversa de WhatsApp (`originais/chat.md`) considerada não confiável e **não são base do catálogo**.
- `docs/fontes/registro-fontes.csv` e `registro-api.csv`: o primeiro é histórico; o segundo está vazio e aguarda a coleta verificável.
- As cópias de segurança de trabalho (`docs/legado/`) não fazem parte do pacote de transferência.

## Imagens e licenças

Toda imagem precisa de origem identificável e licença verificada. Não presuma que imagens da Fandom sejam livres. O `hero.jpg` é arte do jogo (Team Cherry) fornecida pelo proprietário, com a licença **a revisar**. O registro formal de imagens ainda não foi criado.

## Regras do projeto

Não inventar dados nem imagens. Não usar imagens geradas por IA. Preservar o que funciona. Registrar problemas e limitações. Não declarar um teste como feito sem tê-lo executado.
