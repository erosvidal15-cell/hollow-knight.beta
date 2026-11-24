> **AVISO (2026-11-15): DOCUMENTO HISTÓRICO.** Os documentos derivados do arquivo `chat.md` (conversa de WhatsApp), considerado **não confiável** como base do catálogo, por decisão do projeto. Não use este conteúdo para preencher dados do site. Mantido apenas para rastreabilidade; nada aqui foi confirmado em fonte verificável.

## Aviso sobre documentos históricos (2026-11-15)

São históricos: `originais/chat.md`, `registro-fontes.csv`, `inventario.md`, `duplicacoes.md`, `glossario.md` e `pendencias.md`. Estão preservados, mas **não são base do catálogo**. O CSV não recebeu aviso interno para manter o formato intacto; vale este aviso. `registro-api.csv` não deriva do chat (está vazio e aguarda coleta verificável).

# docs/fontes

Esta pasta é só para manutenção: o site não a carrega nem exibe.

| Arquivo | Para que serve |
|---|---|
| `originais/` | Cópias intactas dos arquivos recebidos. Nunca editar. |
| `inventario.md` | Quais arquivos foram recebidos e analisados |
| `registro-fontes.csv` | Uma linha por informação recebida: origem, categoria, id, duplicações, status |
| `registro-api.csv` | Uma linha por informação coletada da API (URL, data, licença). Vazio por enquanto |
| `duplicacoes.md` | Repetições, variantes e nomes parecidos |
| `glossario.md` | Termos e nomes canônicos |
| `pendencias.md` | O que falta verificar |
| `decisoes.md` | O que você aprovou e a sequência vigente |

Os CSV usam ponto e vírgula e abrem direto no Excel. Colunas importantes: `nome_original` (exatamente como veio), `nome_normalizado` (o que vai para o site), `status_verificacao`, `duplicata_de` e `relacionado_a`.
