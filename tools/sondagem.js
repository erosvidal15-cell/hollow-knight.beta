// SONDAGEM DA API (prova de conceito). Ferramenta de desenvolvimento, fora do site público.
// Só leitura, poucas requisições, nada é salvo. O núcleo não usa o DOM (recebe fetchFn e onStep),
// por isso pode ser testado fora do navegador. Nenhum formato de resposta é presumido: tudo é lido com "?.".
export const BASES = [
  { url: 'https://hollowknight.fandom.com/pt-br/api.php', nota: 'planejada no projeto' },
  { url: 'https://hollowknight.fandom.com/pt/api.php', nota: 'derivada da URL de referência dos Chefes; hipótese a testar' },
];
export const MODULOS = ['query+categorymembers', 'query+pageimages', 'query+images', 'query+imageinfo', 'query+revisions', 'parse'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pagesOf = (d) => { const p = d?.query?.pages; return Array.isArray(p) ? p : Object.values(p ?? {}); };
const cut = (v, n = 2500) => { const s = JSON.stringify(v ?? null); return s.length > n ? s.slice(0, n) + '…[cortado]' : (v ?? null); };

// Uma chamada à API. Nunca lança erro: devolve sempre { kind, httpStatus, data, error, url, ms }.
async function call(fetchFn, base, params, { origin = true } = {}) {
  const q = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  if (origin) q.set('origin', '*'); // parâmetro MediaWiki para CORS anônimo (a validar)
  const out = { url: `${base}?${q}`, httpStatus: null, kind: '', data: null, error: '', ms: 0 };
  const t0 = Date.now();
  try {
    const res = await fetchFn(out.url, { mode: 'cors', credentials: 'omit' });
    out.httpStatus = res.status;
    const text = await res.text();
    try { out.data = JSON.parse(text); } catch { out.kind = 'resposta-nao-json'; out.error = String(text).slice(0, 200); }
    if (!res.ok) out.kind = out.kind || 'http-' + res.status;
    else if (out.data?.error) { out.kind = 'erro-da-api'; out.error = `${out.data.error.code}: ${out.data.error.info}`; }
    else if (!out.kind) out.kind = 'ok';
  } catch (e) { out.kind = 'rede-ou-cors'; out.error = String(e?.message ?? e); }
  out.ms = Date.now() - t0;
  return out;
}

function explain(res) {
  if (res.kind === 'rede-ou-cors') return 'O navegador bloqueou ou não alcançou a requisição. Ele não distingue CORS de falha de rede; veja o Console (F12) para a mensagem. ' + res.error;
  if (res.kind === 'erro-da-api') return 'A API respondeu com erro: ' + res.error;
  if (res.kind === 'resposta-nao-json') return `Resposta não é JSON (HTTP ${res.httpStatus}); pode ser página de bloqueio: ${res.error}`;
  return `${res.kind} (HTTP ${res.httpStatus})`;
}

export async function runProbe({ bases = BASES, categoryTitle = 'Categoria:Chefes', fetchFn = globalThis.fetch?.bind(globalThis),
  onStep = () => {}, delayMs = 400, maxRequests = 20 } = {}) {
  let requests = 0;
  const report = { geradoEm: new Date().toISOString(),
    ambiente: { origemDaPagina: globalThis.location?.origin ?? '(fora do navegador)', navegador: globalThis.navigator?.userAgent ?? '(fora do navegador)' },
    parametros: { bases: bases.map((b) => b.url), categoryTitle, delayMs, maxRequests }, resultados: [], conclusoes: {}, requisicoes: 0 };
  const push = (r) => { report.resultados.push(r); onStep(r); };
  const api = async (url, params, opts) => {
    if (requests >= maxRequests) return { kind: 'limite-interno', url: '', data: null, error: 'limite de requisições atingido', ms: 0, httpStatus: null };
    if (requests > 0) await sleep(delayMs);
    requests++;
    return call(fetchFn, url, params, opts);
  };
  const row = (id, teste, base, res, status, resumo, detalhes, extra = {}) =>
    push({ id, teste, base, status, httpStatus: res?.httpStatus ?? null, ms: res?.ms ?? 0, url: res?.url ?? '', resumo, detalhes: cut(detalhes ?? res?.data), ...extra });
  const warn = (res) => (res?.data?.warnings ? ' | avisos da API: ' + JSON.stringify(res.data.warnings).slice(0, 300) : '');
  const finish = () => { report.requisicoes = requests; return report; };

  // T1: acesso com origin=*, para cada endereço
  let working = null; const ns = { cat: '', file: '' }; const accessible = [];
  for (const b of bases) {
    const res = await api(b.url, { action: 'query', meta: 'siteinfo', siprop: 'general|namespaces|rightsinfo' });
    if (res.kind !== 'ok') { row('T1', 'Acesso (com origin=*)', b.url, res, 'falha', explain(res)); continue; }
    const q = res.data?.query ?? {}, g = q.general, n = q.namespaces ?? {}, r = q.rightsinfo;
    const nsName = (i) => n[i]?.name ?? n[i]?.['*'] ?? '';
    accessible.push(b.url);
    row('T1', 'Acesso (com origin=*)', b.url, res, g ? 'ok' : 'parcial',
      `site=${g?.sitename ?? '?'}; idioma=${g?.lang ?? '?'}; software=${g?.generator ?? '?'}; categorias="${nsName(14)}"; arquivos="${nsName(6)}"; licença declarada pelo site: ${r?.text ?? '(não informada)'}${r?.url ? ' [' + r.url + ']' : ''}${warn(res)}`,
      { general: g, rightsinfo: r });
    if (!working) { working = b; ns.cat = nsName(14); ns.file = nsName(6); }
  }
  report.conclusoes.basesAcessiveis = accessible;
  if (!working) { report.conclusoes.acessoOk = false; return finish(); }
  report.conclusoes.acessoOk = true; report.conclusoes.baseUsada = working.url;
  const base = working.url;

  // T2: sem origin (testa se o servidor já envia cabeçalhos CORS por conta própria)
  const t2 = await api(base, { action: 'query', meta: 'siteinfo', siprop: 'general' }, { origin: false });
  report.conclusoes.corsSemOrigin = t2.kind === 'ok';
  row('T2', 'Acesso sem origin=*', base, t2, t2.kind === 'ok' ? 'ok' : 'falha', t2.kind === 'ok' ? 'O servidor permitiu a leitura sem o parâmetro origin.' : explain(t2));

  // T3: módulos e limites
  const pi = await api(base, { action: 'paraminfo', modules: MODULOS.join('|') });
  let missing = 'não verificado', limite = null;
  if (pi.kind === 'ok') {
    const mods = pi.data?.paraminfo?.modules ?? [], found = mods.map((m) => m.path ?? m.name);
    missing = MODULOS.filter((m) => !found.includes(m));
    const lim = mods.find((m) => (m.path ?? m.name) === 'query+categorymembers')?.parameters?.find((p) => p.name === 'limit');
    limite = lim ? { max: lim.max ?? null, highmax: lim.highmax ?? null } : null;
    row('T3', 'Módulos disponíveis (paraminfo)', base, pi, missing.length ? 'parcial' : 'ok',
      `encontrados: ${found.join(', ') || 'nenhum'}; ausentes: ${missing.join(', ') || 'nenhum'}; limite de categorymembers: ${limite ? JSON.stringify(limite) : 'não informado'}${warn(pi)}`, { found, missing, limite });
  } else row('T3', 'Módulos disponíveis (paraminfo)', base, pi, 'falha', explain(pi) + ' Os módulos serão inferidos pelos testes seguintes.');
  report.conclusoes.modulosAusentes = missing; report.conclusoes.limiteCategoryMembers = limite;

  // T4: amostra da categoria (5 páginas) e subcategorias
  const cm = await api(base, { action: 'query', list: 'categorymembers', cmtitle: categoryTitle, cmlimit: '5', cmtype: 'page', cmprop: 'title|ids|type' });
  const members = cm.data?.query?.categorymembers ?? [], titles = members.map((m) => m.title);
  report.conclusoes.paginacaoToken = Boolean(cm.data?.continue);
  const usouPrefixo = categoryTitle.split(':')[0];
  row('T4', `Membros de "${categoryTitle}" (amostra de 5)`, base, cm, cm.kind !== 'ok' ? 'falha' : titles.length ? 'ok' : 'parcial',
    cm.kind !== 'ok' ? explain(cm) : `${titles.length} páginas: ${titles.join('; ') || '(nenhuma: título incorreto ou categoria vazia)'}; campo "continue" ${cm.data?.continue ? 'presente (há mais páginas)' : 'ausente'}; prefixo usado "${usouPrefixo}" (a wiki informa "${ns.cat}")${warn(cm)}`);
  const sc = await api(base, { action: 'query', list: 'categorymembers', cmtitle: categoryTitle, cmlimit: '5', cmtype: 'subcat', cmprop: 'title|type' });
  const subs = sc.data?.query?.categorymembers ?? [];
  report.conclusoes.subcategoriasNaAmostra = sc.kind === 'ok' ? subs.length : 'não verificado';
  row('T4b', 'Subcategorias da categoria', base, sc, sc.kind === 'ok' ? 'ok' : 'falha', sc.kind === 'ok' ? `${subs.length} subcategoria(s): ${subs.map((s) => s.title).join('; ') || 'nenhuma'}` : explain(sc));
  if (!titles.length) {
    row('T5-T9', 'Imagens e metadados', base, null, 'ignorado', 'Ignorados: não há páginas de amostra.');
    return finish();
  }

  // T5: imagem principal (módulo pageimages) das 5 páginas
  const pim = await api(base, { action: 'query', prop: 'pageimages', titles: titles.join('|'), piprop: 'thumbnail|name|original', pithumbsize: '300' });
  const pgs = pagesOf(pim.data), withImg = pgs.filter((p) => p.thumbnail?.source), pick = withImg[0];
  report.conclusoes.imagensNaAmostra = pim.kind === 'ok' ? `${withImg.length} de ${pgs.length}` : 'não verificado';
  row('T5', 'Imagem principal (pageimages)', base, pim, pim.kind !== 'ok' ? 'falha' : withImg.length === pgs.length && pgs.length ? 'ok' : 'parcial',
    pim.kind !== 'ok' ? explain(pim) : `${withImg.length} de ${pgs.length} páginas com miniatura${warn(pim)}`,
    pgs.map((p) => ({ title: p.title, pageimage: p.pageimage ?? null, thumb: p.thumbnail?.source ?? null })));

  // T6 (só se T5 não achou imagem): lista de arquivos da página, método alternativo do núcleo
  let fileTitle = pick?.pageimage ? `${ns.file || 'File'}:${pick.pageimage}` : '';
  if (!pick) {
    const im = await api(base, { action: 'query', prop: 'images', titles: titles[0], imlimit: '10' });
    const files = (pagesOf(im.data)[0]?.images ?? []).map((i) => i.title);
    fileTitle = files[0] ?? '';
    row('T6', 'Arquivos da página (prop=images)', base, im, im.kind !== 'ok' ? 'falha' : files.length ? 'parcial' : 'parcial',
      im.kind !== 'ok' ? explain(im) : `${files.length} arquivo(s) na primeira página: ${files.join('; ') || 'nenhum'}`);
  }

  // T7: metadados e licença do arquivo
  let ii = null;
  if (fileTitle) {
    const info = await api(base, { action: 'query', prop: 'imageinfo', titles: fileTitle, iiprop: 'url|size|mime|extmetadata|timestamp|user' });
    ii = pagesOf(info.data)[0]?.imageinfo?.[0] ?? null;
    const meta = ii?.extmetadata ?? {}, lic = meta.LicenseShortName?.value ?? meta.UsageTerms?.value ?? null;
    report.conclusoes.metadadosDeArquivo = Boolean(ii); report.conclusoes.licencaPorArquivoNaApi = Boolean(lic);
    row('T7', 'Metadados do arquivo (imageinfo)', base, info, info.kind !== 'ok' ? 'falha' : ii ? (lic ? 'ok' : 'parcial') : 'parcial',
      info.kind !== 'ok' ? explain(info) : ii ? `arquivo=${fileTitle}; ${ii.width ?? '?'}x${ii.height ?? '?'}; ${ii.size ?? '?'} bytes; ${ii.mime ?? '?'}; enviado por ${ii.user ?? '?'}; campos de extmetadata: ${Object.keys(meta).join(', ') || 'nenhum'}; licença na API: ${lic ?? 'NÃO informada (verificar na página do arquivo)'}` : 'imageinfo vazio para este arquivo',
      { fileTitle, imageinfo: ii ? { url: ii.url, width: ii.width, height: ii.height, size: ii.size, mime: ii.mime, timestamp: ii.timestamp, user: ii.user, extmetadata: meta } : null });
  } else row('T7', 'Metadados do arquivo (imageinfo)', base, null, 'ignorado', 'Ignorado: nenhuma imagem de amostra.');

  // T8: o navegador consegue LER a miniatura (CORS de imagem)? A miniatura é lida e descartada; nada é salvo.
  const thumb = pick?.thumbnail?.source ?? '';
  if (thumb && requests < maxRequests) {
    await sleep(delayMs); requests++;
    const t0 = Date.now(); let st = 'ok', resumo;
    try {
      const r = await fetchFn(thumb, { mode: 'cors', credentials: 'omit' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const b = await r.blob();
      report.conclusoes.downloadDeImagemNoNavegador = true;
      resumo = `miniatura lida pelo navegador: ${b.size} bytes, tipo ${b.type || '?'} (descartada, nada foi salvo)`;
    } catch (e) {
      report.conclusoes.downloadDeImagemNoNavegador = false; st = 'falha';
      resumo = `o navegador não conseguiu ler a imagem por fetch (${e?.message ?? e}). A pré-visualização usa <img>, que funciona mesmo sem CORS.`;
    }
    row('T8', 'Leitura da miniatura pelo navegador', base, { url: thumb, httpStatus: null, ms: Date.now() - t0 }, st, resumo, null, { preview: thumb });
  } else row('T8', 'Leitura da miniatura pelo navegador', base, null, 'ignorado', 'Ignorado: sem miniatura de amostra.');

  // T9: revisão da página (para registrar a versão consultada)
  const rv = await api(base, { action: 'query', prop: 'revisions', titles: titles[0], rvprop: 'ids|timestamp' });
  const rev = pagesOf(rv.data)[0]?.revisions?.[0];
  report.conclusoes.revisaoDisponivel = Boolean(rev);
  row('T9', 'Revisão da página (rastreabilidade)', base, rv, rv.kind !== 'ok' ? 'falha' : rev ? 'ok' : 'parcial',
    rv.kind !== 'ok' ? explain(rv) : rev ? `página="${titles[0]}"; revid=${rev.revid ?? '?'}; data=${rev.timestamp ?? '?'}` : 'sem dados de revisão');
  return finish();
}
