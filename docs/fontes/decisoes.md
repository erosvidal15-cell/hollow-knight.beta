> **ATENÇÃO (2026-11-15):** as decisões D03, D04 e D07 estão **suspensas** (dependiam de listas do `chat.md`, não confiável). A sequência de etapas vigente é a do prompt-mestre (8 etapas); a seção "Sequência vigente" abaixo é anterior a ela.

# Decisões aprovadas

## 2026-11-15

| ID | Decisão |
|---|---|
| D01 | Nova categoria "Modos e DLCs"; 11ª categoria na página inicial (autorizado) |
| D02 | Estações de besouro dentro de Regiões, com `type` |
| D03 | **[SUSPENSA em 2026-11-15]** Quatro entradas finais do Diário pendentes de classificação e fora do site |
| D04 | **[SUSPENSA em 2026-11-15]** Lanterna de Lumélula, Mapa e Pena e Marca do Rei: Itens (provisório). Ferrão dos Sonhos: Habilidades (provisório, sujeito a verificação). Portal dos Sonhos: Habilidades (provisório) |
| D05 | Ids estáveis, prefixos (`estacao-`, `conquista-`, `modo-`, `dlc-`) e referências cruzadas; preservar todas as ocorrências originais; não unir variantes sem confirmação |
| D06 | Pasta `docs/fontes/`, registro de origem, glossário e pendências |
| D07 | **[SUSPENSA em 2026-11-15]** Normalização de espaços, capitalização e formatação nos dados do site, preservando os originais. Correções de grafia só após confirmação |
| D08 | API da Hollow Knight Fandom em português como fonte principal, **opção B**: coletar uma vez, revisar e salvar em JSON. O site deve funcionar sem a API; respeitar licenças; registrar fontes; evitar consultas desnecessárias. Conteúdo da Fandom não é automaticamente oficial nem as imagens são livres |
| D09 | Itens de demonstração mantidos até os dados reais estarem organizados, integrados e testados |
| D10 | Personagens vazio até haver informação confirmada |
| D11 | Redesign visual como etapa própria: atmosfera de Hallownest, azul profundo, preto, cinza azulado e detalhes claros; texturas de pedra e pergaminho; inspiração em menus, mapas e diário do caçador. Referências serão fornecidas em pastas |
| D12 | Prioridade de domingo: Etapas 2 a 5; segunda-feira para revisão (**Correção 2026-11-15:** domingo = 15/11/2026 e segunda-feira = 16/11/2026; o prompt-mestre citava 16/11 e 17/11 por engano) |
| D13 | Etapa 1 limitada a `docs/fontes/`; avançar só com autorização explícita |

## Sequência vigente

1. Rastreabilidade (`docs/fontes/`). 2. Dados reais (nomes), Modos e DLCs, validador. 3. Direção de arte. 4. Redesign implementado. 5. UX das categorias. 6. API (sondagem, coleta, revisão). 7. Imagens e licenças. 8. Lore, Guias, Sobre, Personagens, remoção dos demos e documentação final.

## 2026-11-15 (2ª rodada)

| ID | Decisão |
|---|---|
| D14 | Autorizados avisos de "documento histórico" nos documentos derivados do `chat.md`. Nada foi apagado |
| D15 | Conversas do WhatsApp não são base confiável do catálogo (prompt-mestre, seção 9). **D03, D04 e D07 suspensas**; D01, D02, D05 e D06 mantidas, a rever na Etapa 2 com dados verificáveis |
| D16 | Dados reais pela opção A: página de sondagem e coleta no navegador. Primeiro só uma prova de conceito pequena (API, CORS, módulos, imagens). Sem coleta massiva antes de apresentar os resultados |
| D17 | Chefes: aguardar as capturas de tela da referência. Nada será implementado antes da análise e da proposta visual aprovada. Outras categorias não serão alteradas |
| D18 | Restrições: não alterar o redesign; preservar arquivos existentes; alterações pequenas e documentadas; informar arquivos modificados |
| D19 | Calendário: domingo = 15/11/2026; segunda-feira = 16/11/2026 |

## Registro de alterações (2026-11-15, 2ª rodada)

- **Modificados (só documentação):** `docs/fontes/LEIA-ME.md`, `inventario.md`, `duplicacoes.md`, `glossario.md`, `pendencias.md` (aviso no topo) e `decisoes.md` (aviso, D03/D04/D07 suspensas, correção em D12, D14-D19 e este registro). Nenhum texto foi removido.
- **Criados:** `tools/sondagem.html` e `tools/sondagem.js`.
- **Inalterados:** `docs/fontes/registro-fontes.csv`, `registro-api.csv`, `originais/chat.md` e todo o site.

## 2026-11-23 (correções da auditoria)

| ID | Decisão |
|---|---|
| D20 | Autorizadas as correções 1 a 5 da auditoria: export de `normalize`, ícones `npcs`/`mapas`/`modos`, skip-link, foco do modal sem rolagem e contraste de bordas e placeholders |
| D21 | Problema 6 (altura do hero) **não aplicado**: aguarda aprovação de uma entre duas propostas com capturas comparativas |
| D22 | O trabalho é feito em cópia isolada, sem repositório Git nem acesso ao GitHub; as alterações precisam ser aplicadas e commitadas pelo proprietário. Backup: `docs/legado/pre-correcoes-2026-11-23/` |

### Registro de alterações (correções 1 a 5)

- `js/utils.js`: exporta `normalize`.
- `js/icons.js`: ícones `npcs`, `mapas` e `modos`.
- `index.html` e `pages/*.html` (15): o skip-link deixou de usar `visually-hidden`.
- `js/modal.js`: `focus({ preventScroll: true })` no título e no elemento que abriu o modal.
- `css/variables.css`: novo token `--hk-control` (bordas de controles e ícones placeholder, 3:1 ou mais).
- `css/base.css`: `--hk-control` em `.btn`, `.btn-hk--ghost` e `.icon-btn`; `scroll-padding-top` do `html` trocado por `scroll-margin-top` nos destinos de âncora (o primeiro rolava a página ao focar controles do cabeçalho); skip-link com `position: fixed`.
- `css/components.css`: `--hk-control` em `.search input`, `.history-btn`, `.chip` e `.ph`.
- `css/pages.css`: borda e cor de placeholder do campo de filtro.
- `docs/fontes/decisoes.md`: este registro.

### Problemas remanescentes conhecidos

- `index.html#categorias` aberto em carregamento novo (por exemplo, a partir de outra página) para antes da seção, porque o cabeçalho é injetado depois do salto e o layout muda. Já ocorria antes das correções.

## 2026-11-23 (hero e âncoras)

| ID | Decisão |
|---|---|
| D23 | Problema 6: aprovada a **proposta A** (hero compacto, `clamp(200px, 30vh, 280px)`), preservando imagem de fundo, overlay e ornamentos |
| D24 | Autorizada a correção das âncoras no carregamento inicial (`index.html#categorias`) |
| D25 | Implementado: reserva de altura do cabeçalho enquanto é injetado (`#site-header`) e novo módulo `js/anchor.js`, que reposiciona uma única vez depois da montagem da página, exceto se o visitante já interagiu. Resolve o "problema remanescente" listado na seção anterior |

### Registro de alterações (hero e âncoras)

- `css/components.css`: hero compacto (altura, respiro, tamanhos do título, subtítulo e texto, margem dos ornamentos) e `#site-header { min-height }`.
- `js/anchor.js` (novo), `js/main.js` e `js/page.js`: iniciam o módulo de âncora por último.
- Backup anterior a esta rodada: `docs/legado/pre-hero-ancora-2026-11-23/`.

### Problemas remanescentes conhecidos

- Em janelas altas (por exemplo 1024 px ou 1080 px de altura), `#destaques` não chega ao topo da tela: a página já está no limite de rolagem e a seção aparece inteira. É o comportamento esperado do navegador.

## 2026-11-23 (consolidação para transferência)

### Decisões já em vigor que não estavam registradas

| ID | Decisão |
|---|---|
| D26 | O prompt-mestre de 2026-11-21 passa a ser a referência vigente: 13 categorias (incluindo NPCs, Mapas e Modos e DLCs), 6 grupos temáticos mais "Diversos", fichas em modal, busca global, histórico no LocalStorage (sem favoritos), página dos criadores e fundo da home em imagem, sem partículas constantes |
| D27 | **Revisão de D01:** "Modos e DLCs" é a 13ª categoria (grupo Diversos), não a 11ª |
| D28 | **Revisão de D05:** ids únicos em todo o site. A mesma entidade em duas categorias vira duas fichas ligadas por `related`, e a relação inversa é automática. Os prefixos de id seguem recomendados para nomes que se repetem entre tipos |
| D29 | **Revisão de D11:** a direção visual passa a ser preto, cinzas escuros e branco, com ornamentos brancos e títulos em Cormorant SC. O dourado saiu da interface; o token `--hk-gold` fica sem uso |
| D30 | **Revisão de D17:** os catálogos (incluindo Chefes) seguem a descrição textual do prompt-mestre: grade de miniaturas com nome, e o clique abre o modal. Não há página de detalhe por item. A captura da página de Chefes da Fandom nunca foi recebida |
| D31 | Decisão técnica do assistente, explicada no diagnóstico de 2026-11-21 e não contestada: remover o Bootstrap (usado só para grade e navbar) e usar CSS próprio. Efeitos: o cabeçalho e o submenu passaram a ser próprios, o scrollspy foi removido e a seção "Uma wiki em construção" saiu da home |
| D32 | `js/hero.js` (partículas e parallax) foi mantido no repositório, mas não é iniciado |
| D33 | `data/featured.json` passou a listar ids de conteúdos (`{ "items": [...] }`) em vez de cards-link; ids inexistentes são ignorados |
| D34 | Fundo da home: arte do jogo fornecida pelo proprietário (1200×675), convertida para `assets/images/backgrounds/hero.jpg`. Licença **não verificada, a revisar**; o registro formal de imagens está pendente |
| D35 | Histórico: chave `hkwiki.historico.v1`, até 20 entradas e sem duplicar visualizações consecutivas |
| D36 | Os itens de demonstração ganharam três novos exemplos (chefe, região e personagem), todos com `demo: true`, para testar relações, busca e modal. Nenhum dado do jogo foi inventado |

### Decisão de empacotamento (proposta do assistente nesta rodada)

| ID | Decisão |
|---|---|
| D37 | A reforma de 2026-11-21 nunca foi entregue em pacote completo, então o ZIP de atualização, sozinho, não reproduz o projeto sobre a última versão entregue. Foram gerados dois pacotes: o ZIP de atualização (29 arquivos) e o ZIP completo do projeto, sem `docs/legado`. O proprietário usa o completo, a menos que o repositório já contenha a reforma |

### Revisões de decisões anteriores

- **D21** (problema 6 aguardando aprovação) foi superada por **D23** (proposta A aplicada).
- A seção **"Sequência vigente"** acima é anterior ao prompt-mestre de 2026-11-21. A sequência atual tem 9 etapas: 1 inspeção; 2 arquitetura e dados; 3 componentes compartilhados; 4 página inicial; 5 páginas internas; 6 criadores; 7 API e imagens; 8 responsividade e acessibilidade; 9 revisão final.
- **D02, D06, D08, D09 e D10** continuam válidas. **D03, D04 e D07** continuam suspensas. A sondagem (D16) ainda não foi executada pelo proprietário e nenhuma coleta foi feita.

### Registro de alterações (2026-11-23, consolidação)

- Reescritos: `PROJETO.md` e `PROGRESSO.md` (versões anteriores preservadas em `docs/legado/`).
- Acrescentada esta seção em `docs/fontes/decisoes.md`.
- Nenhum arquivo de código, estilo ou dados foi alterado nesta rodada.
