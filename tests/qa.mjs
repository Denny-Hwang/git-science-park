// tests/qa.mjs — 헤드리스 브라우저로 전 실험 페이지를 자동 검증한다.
// (탭 전환 동작 · 콘솔/페이지 에러 0 · 허브 ready 카드 수)
// v2.0-B: Chromium / Firefox / WebKit 교차 검증. 설치되지 않은 엔진은 건너뛴다(로컬=Chromium).
// 주의: 이 도구는 CI/테스트 전용이다. 사이트(src/)는 런타임 의존성이 전혀 없다.
import { chromium, firefox, webkit } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const data = JSON.parse(readFileSync(new URL('../src/data/experiments.json', import.meta.url)));
const pages = data.experiments.map((e) => `experiments/${e.category}/${e.slug}.html`);

// 기본은 세 엔진 모두. ENGINES=chromium 처럼 환경변수로 좁힐 수 있다.
const ALL = { chromium, firefox, webkit };
const want = (process.env.ENGINES || 'chromium,firefox,webkit').split(',').map((s) => s.trim()).filter(Boolean);

let grandFail = 0;
const ran = [];
const skipped = [];

for (const name of want) {
  const engine = ALL[name];
  if (!engine) { console.log(`?  unknown engine "${name}" — skip`); continue; }

  let browser;
  try {
    browser = await engine.launch();
  } catch (e) {
    skipped.push(name);
    console.log(`–  ${name}: 설치 안 됨/실행 불가 — 건너뜀 (${e.message.split('\n')[0].slice(0, 80)})`);
    continue;
  }
  ran.push(name);
  let fail = 0;

  for (const rel of pages) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
    page.on('pageerror', (e) => errs.push('PAGEERR: ' + e.message.split('\n')[0]));
    let status = 0, tabs = false;
    try {
      const resp = await page.goto(`${BASE}/${rel}`, { waitUntil: 'load', timeout: 20000 });
      status = resp.status();
      await page.waitForTimeout(200);
      tabs = await page.evaluate(() => {
        const vis = (el) => el && getComputedStyle(el).display !== 'none';
        const btns = [...document.querySelectorAll('.tab-btn')];
        const pn = [...document.querySelectorAll('.tab-content')];
        if (btns.length !== 3 || pn.length !== 3 || pn.filter(vis).length !== 1) return false;
        for (const b of btns) { b.click(); const t = document.getElementById(b.dataset.tab); if (!vis(t)) return false; }
        return true;
      });
    } catch (e) { errs.push('EXC: ' + e.message.split('\n')[0]); }
    const ok = status === 200 && tabs && errs.length === 0;
    if (!ok) { fail++; console.log(`FAIL [${name}] ${rel}  status=${status} tabs=${tabs} errs=${errs.slice(0, 2).join(' | ')}`); }
    await ctx.close();
  }

  // 허브
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const herr = [];
  page.on('pageerror', (e) => herr.push(e.message.split('\n')[0]));
  await page.goto(`${BASE}/index.html`, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(500);
  const hub = await page.evaluate(() => ({
    ready: document.querySelectorAll('.card.is-ready').length,
    langs: document.querySelectorAll('.lang-switcher option').length
  }));
  if (hub.ready !== pages.length || hub.langs !== 10 || herr.length) {
    fail++; console.log(`FAIL [${name}] hub  ready=${hub.ready}/${pages.length} langs=${hub.langs} pageerrors=${herr.length}`);
  }
  await ctx.close();
  await browser.close();

  console.log(fail === 0 ? `PASS [${name}] — ${pages.length} pages + hub` : `FAIL [${name}] — ${fail} issue(s)`);
  grandFail += fail;
}

if (ran.length === 0) { console.log('ERROR — no browser engine could launch'); process.exit(2); }
console.log(`\nengines run: ${ran.join(', ')}${skipped.length ? ` | skipped: ${skipped.join(', ')}` : ''}`);
console.log(grandFail === 0 ? `PASS — all ${ran.length} engine(s) OK` : `FAILED — ${grandFail} issue(s)`);
process.exit(grandFail === 0 ? 0 : 1);
