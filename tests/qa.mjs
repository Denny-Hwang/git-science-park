// tests/qa.mjs — 헤드리스 Chromium으로 전 실험 페이지를 자동 검증한다.
// (탭 전환 동작 · 콘솔/페이지 에러 0 · 허브 ready 카드 수)
// 주의: 이 도구는 CI/테스트 전용이다. 사이트(src/)는 런타임 의존성이 전혀 없다.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const data = JSON.parse(readFileSync(new URL('../src/data/experiments.json', import.meta.url)));
const pages = data.experiments.map((e) => `experiments/${e.category}/${e.slug}.html`);

let fail = 0;
const browser = await chromium.launch();

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
    await page.waitForTimeout(150);
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
  if (!ok) { fail++; console.log(`FAIL  ${rel}  status=${status} tabs=${tabs} errs=${errs.slice(0, 2).join(' | ')}`); }
  await ctx.close();
}

// 허브
const ctx = await browser.newContext();
const page = await ctx.newPage();
const herr = [];
page.on('pageerror', (e) => herr.push(e.message.split('\n')[0]));
await page.goto(`${BASE}/index.html`, { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(400);
const hub = await page.evaluate(() => ({ ready: document.querySelectorAll('.card.is-ready').length }));
if (hub.ready !== pages.length || herr.length) {
  fail++; console.log(`FAIL  hub  ready=${hub.ready}/${pages.length} pageerrors=${herr.length}`);
}
await ctx.close();
await browser.close();

console.log(fail === 0 ? `PASS — ${pages.length} experiment pages + hub OK` : `FAILED — ${fail} issue(s)`);
process.exit(fail === 0 ? 0 : 1);
