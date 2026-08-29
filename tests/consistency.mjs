// tests/consistency.mjs — 데이터·파일·문서 정합성 게이트 (브라우저 불필요, 수 초 내 완료)
// experiments.json 을 단일 진실 공급원(source of truth)으로 삼아 아래를 검증한다.
//  1) 실험 메타 ↔ 실제 HTML 파일 1:1 대응 (누락/고아 파일 없음)
//  2) id·(category, slug) 유일성, category 참조 유효성
//  3) sitemap.xml 이 허브 + 모든 실험 페이지를 정확히 포함
//  4) index.html 기본 통계(stat-exp/stat-cat)와 메타 설명의 실험 개수 일치
//  5) README 배지·본문 대표 개수 일치
//  6) i18n 사전(UI 10개 언어) JSON 유효성 + en 기준 키 동등성
// 과거 "문서 53/65개 vs 실제 70개" 불일치, 사이트맵 17페이지 누락과 같은
// 드리프트가 재발하면 CI에서 즉시 실패하도록 하는 회귀 방지 장치다.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'src');

let fail = 0;
function ok(cond, msg) {
  if (cond) console.log('ok    ' + msg);
  else { fail++; console.log('FAIL  ' + msg); }
}

const data = JSON.parse(readFileSync(path.join(SRC, 'data/experiments.json'), 'utf8'));
const exps = data.experiments;
const catIds = new Set(data.categories.map((c) => c.id));

// 1) 메타 ↔ 파일 대응
const inJson = new Set(exps.map((e) => `${e.category}/${e.slug}`));
const onDisk = new Set();
for (const cat of readdirSync(path.join(SRC, 'experiments'))) {
  const dir = path.join(SRC, 'experiments', cat);
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.html')) onDisk.add(`${cat}/${f.slice(0, -5)}`);
  }
}
const noFile = [...inJson].filter((k) => !onDisk.has(k));
const orphan = [...onDisk].filter((k) => !inJson.has(k));
ok(noFile.length === 0, `every experiment in experiments.json has an HTML file${noFile.length ? ` — missing: ${noFile.join(', ')}` : ''}`);
ok(orphan.length === 0, `every experiment HTML file is registered in experiments.json${orphan.length ? ` — orphans: ${orphan.join(', ')}` : ''}`);

// 2) 유일성·참조 유효성
// id는 1..N의 정수로 전역 유일·연속(빠짐없음) — DATA-MODEL.md 6장의 불변식.
const ids = exps.map((e) => e.id);
const badIds = exps.filter((e) => !Number.isInteger(e.id) || e.id < 1 || e.id > exps.length);
ok(badIds.length === 0, `every experiment id is an integer in 1..${exps.length}${badIds.length ? ` — bad: ${badIds.map((e) => `${e.slug}=${e.id}`).join(', ')}` : ''}`);
ok(new Set(ids).size === ids.length, 'experiment ids are unique');
ok([...ids].sort((a, b) => a - b).every((v, i) => v === i + 1), `experiment ids are contiguous 1..${exps.length}`);
ok(new Set(exps.map((e) => `${e.category}/${e.slug}`)).size === exps.length, '(category, slug) pairs are unique');
const badCat = exps.filter((e) => !catIds.has(e.category));
ok(badCat.length === 0, `every experiment references a defined category${badCat.length ? ` — bad: ${badCat.map((e) => e.slug).join(', ')}` : ''}`);

// 3) sitemap 커버리지
const sitemap = readFileSync(path.join(SRC, 'sitemap.xml'), 'utf8');
const smPages = new Set([...sitemap.matchAll(/experiments\/([\w-]+\/[\w-]+)\.html/g)].map((m) => m[1]));
const smMissing = [...inJson].filter((k) => !smPages.has(k));
const smExtra = [...smPages].filter((k) => !inJson.has(k));
ok(smMissing.length === 0, `sitemap.xml covers all ${exps.length} experiment pages${smMissing.length ? ` — missing ${smMissing.length}: ${smMissing.slice(0, 5).join(', ')}…` : ''}`);
ok(smExtra.length === 0, `sitemap.xml has no stale experiment URLs${smExtra.length ? ` — extra: ${smExtra.join(', ')}` : ''}`);
ok(sitemap.includes('https://denny-hwang.github.io/git-science-park/</loc>'), 'sitemap.xml includes the hub URL');

// 4) index.html 기본 통계·메타 설명
const hub = readFileSync(path.join(SRC, 'index.html'), 'utf8');
const statExp = (hub.match(/id="stat-exp">(\d+)</) || [])[1];
const statCat = (hub.match(/id="stat-cat">(\d+)</) || [])[1];
ok(Number(statExp) === exps.length, `index.html default stat-exp (${statExp}) matches data (${exps.length})`);
ok(Number(statCat) === data.categories.length, `index.html default stat-cat (${statCat}) matches data (${data.categories.length})`);
const metaCounts = [...hub.matchAll(/실험 (\d+)개/g)].map((m) => Number(m[1]));
ok(metaCounts.every((n) => n === exps.length), `index.html meta descriptions cite ${exps.length} experiments (found: ${metaCounts.join(', ') || 'none'})`);

// 5) README 대표 개수
const readme = readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const badge = (readme.match(/badge\/Experiments-(\d+)-/) || [])[1];
ok(Number(badge) === exps.length, `README experiments badge (${badge}) matches data (${exps.length})`);
ok(readme.includes(`**${exps.length} experiments**`), `README highlights table cites ${exps.length} experiments`);
const eraBadge = (readme.match(/badge\/Eras-(\d+)-/) || [])[1];
ok(Number(eraBadge) === data.categories.length, `README eras badge (${eraBadge}) matches data (${data.categories.length})`);

// 5b) DATA-MODEL.md (규범 스키마 문서) — "정확히 N개/N이며"로 명시된 개수 불변식이
// 실제 데이터(카테고리·실험 수)와 일치해야 한다.
const dataModel = readFileSync(path.join(ROOT, 'docs/02-design/DATA-MODEL.md'), 'utf8');
const dmCounts = [...dataModel.matchAll(/정확히 (\d+)(?:개|이며)/g)].map((m) => Number(m[1]));
const dmAllowed = new Set([exps.length, data.categories.length]);
ok(dmCounts.length >= 4 && dmCounts.every((n) => dmAllowed.has(n)),
  `DATA-MODEL.md count invariants match data (${exps.length} experiments / ${data.categories.length} categories; found: ${dmCounts.join(', ') || 'none'})`);

// 6) i18n 사전 유효성·키 동등성 (UI 사전 10개 언어)
const i18nDir = path.join(SRC, 'assets/i18n');
const flat = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) =>
  (v && typeof v === 'object') ? flat(v, prefix + k + '.') : [prefix + k]);
const langs = readdirSync(i18nDir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
// i18n.js의 SUPPORTED 목록과 파일명 집합이 정확히 일치해야 한다(개수만 세면
// 파일 하나가 다른 언어로 바뀌어도 통과해 버리고, 그 언어는 조용히 영어로 폴백한다).
const i18nJs = readFileSync(path.join(SRC, 'assets/js/i18n.js'), 'utf8');
const supportedBlock = (i18nJs.match(/SUPPORTED\s*=\s*\[([\s\S]*?)\];/) || [])[1] || '';
const supported = [...supportedBlock.matchAll(/\['([a-z]{2})'/g)].map((m) => m[1]);
ok(supported.length > 0 && supported.includes('en'), `i18n.js SUPPORTED parsed (${supported.length} locales, includes en)`);
const langsSet = new Set(langs);
const supMissing = supported.filter((l) => !langsSet.has(l));
const supExtra = langs.filter((l) => !supported.includes(l));
ok(supMissing.length === 0 && supExtra.length === 0,
  `UI locale files match i18n.js SUPPORTED exactly (${supported.join(', ')})${supMissing.length ? ` — missing files: ${supMissing.join(', ')}` : ''}${supExtra.length ? ` — unlisted files: ${supExtra.join(', ')}` : ''}`);
let en = null;
const parsed = {};
for (const l of langs) {
  try { parsed[l] = JSON.parse(readFileSync(path.join(i18nDir, l + '.json'), 'utf8')); }
  catch (e) { ok(false, `i18n ${l}.json parses (${e.message})`); }
}
en = parsed.en;
ok(!!en, 'en.json parsed — parity baseline available');
if (en) {
  const enKeys = new Set(flat(en));
  for (const l of langs) {
    if (!parsed[l] || l === 'en') continue;
    const keys = new Set(flat(parsed[l]));
    const missing = [...enKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !enKeys.has(k));
    ok(missing.length === 0 && extra.length === 0,
      `i18n ${l}.json keys match en.json${missing.length ? ` — missing: ${missing.slice(0, 3).join(', ')}…` : ''}${extra.length ? ` — extra: ${extra.slice(0, 3).join(', ')}…` : ''}`);
  }
}
// 부속 사전(exp/runtime/body)은 JSON 유효성만 확인(언어별 커버리지는 점진 확대 대상)
for (const sub of ['exp', 'runtime', 'body']) {
  const dir = path.join(i18nDir, sub);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    try { JSON.parse(readFileSync(path.join(dir, f), 'utf8')); }
    catch (e) { ok(false, `i18n ${sub}/${f} parses (${e.message})`); }
  }
}
console.log(`ok    auxiliary i18n dictionaries (exp/runtime/body) all parse`);

console.log(fail === 0 ? '\nPASS — data/docs/sitemap/i18n are consistent' : `\nFAILED — ${fail} consistency issue(s)`);
process.exit(fail === 0 ? 0 : 1);
