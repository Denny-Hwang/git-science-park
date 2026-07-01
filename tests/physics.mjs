// tests/physics.mjs — drives flagship quantum simulations headless and asserts
// KNOWN-CORRECT physics values (regression guard for the math, not just "it loads").
// Extend with more invariants as sims are added. CI/dev only; the site ships zero deps.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch();
let fail = 0;
const num = (s) => parseFloat(String(s).replace(/[^\d.\-]/g, ''));
function ok(cond, msg) { if (!cond) { fail++; console.log('FAIL  ' + msg); } else { console.log('ok    ' + msg); } }

async function open(rel) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 80)); });
  await p.goto(`${BASE}/${rel}`, { waitUntil: 'load', timeout: 20000 });
  await p.waitForTimeout(300);
  return { p, errs };
}

// ---- Bloch sphere: single-qubit gate action ----
{
  const { p, errs } = await open('experiments/09-quantum-computing/01-bloch-sphere.html');
  const p0 = () => p.evaluate(() => document.getElementById('r-p0').textContent);
  ok(num(await p0()) === 100, `bloch |0⟩ → P(0)=100% (${await p0()})`);
  await p.click('#gate-H'); await p.waitForTimeout(600);
  ok(Math.abs(num(await p0()) - 50) < 0.6, `bloch H|0⟩=|+⟩ → P(0)=50% (${await p0()})`);
  await p.click('#gate-H'); await p.waitForTimeout(600);
  ok(num(await p0()) === 100, `bloch HH|0⟩=|0⟩ → P(0)=100% (${await p0()})`);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(300);
  await p.click('#gate-X'); await p.waitForTimeout(600);
  ok(num(await p0()) === 0, `bloch X|0⟩=|1⟩ → P(0)=0% (${await p0()})`);
  ok(errs.length === 0, `bloch no console/page errors`);
}

// ---- Grover: N=8, 1 iteration → success ≈ sin²(3·asin(1/√8)) = 78.1% ----
{
  const { p, errs } = await open('experiments/09-quantum-computing/03-grover.html');
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /1회 반복/.test(x.textContent));
    if (b) b.click();
  });
  await p.waitForTimeout(1400);
  const prob = await p.evaluate(() => document.getElementById('r-prob').textContent);
  ok(num(prob) > 76 && num(prob) < 80, `grover N=8 k=1 → success≈78.1% (${prob})`);
  ok(errs.length === 0, `grover no console/page errors`);
}

// ---- Entanglement: Bell state (|00⟩+|11⟩)/√2 → 50/50 on 00,11 and 0 on 01,10 ----
{
  const { p, errs } = await open('experiments/09-quantum-computing/04-entanglement-bell.html');
  await p.click('#bellBtn'); await p.waitForTimeout(400);
  const g = (id) => p.evaluate((i) => document.getElementById(i).textContent, id);
  const [p00, p01, p10, p11] = [await g('pct-00'), await g('pct-01'), await g('pct-10'), await g('pct-11')];
  ok(num(p01) === 0 && num(p10) === 0, `bell |01⟩,|10⟩ = 0% (${p01}, ${p10})`);
  ok(Math.abs(num(p00) - 50) < 1 && Math.abs(num(p11) - 50) < 1, `bell |00⟩,|11⟩ ≈ 50% (${p00}, ${p11})`);
  ok(errs.length === 0, `bell no console/page errors`);
}

// ---- Deutsch–Jozsa: constant → P(|00⟩)=100%, balanced → P(|00⟩)=0% ----
{
  const { p, errs } = await open('experiments/09-quantum-computing/08-deutsch-jozsa.html');
  async function runOracle(sel) {
    await p.evaluate((s) => { const b = document.querySelector(s); if (b) b.click(); }, `[data-oracle="${sel}"]`);
    await p.waitForTimeout(200);
    // advance the protocol to completion if it is step-based
    await p.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const run = btns.find((x) => /전체 실행|실행|측정|끝까지|자동/.test(x.textContent));
      if (run) run.click();
      else btns.filter((x) => /단계|다음|▶/.test(x.textContent)).forEach((b) => { for (let i = 0; i < 6; i++) b.click(); });
    });
    await p.waitForTimeout(500);
    return p.evaluate(() => document.getElementById('r-p00').textContent);
  }
  const c0 = await runOracle('c0');
  ok(num(c0) >= 99, `deutsch-jozsa constant → P(|00⟩)=100% (${c0})`);
  const bal = await runOracle('xor');
  ok(num(bal) <= 1, `deutsch-jozsa balanced → P(|00⟩)=0% (${bal})`);
  ok(errs.length === 0, `deutsch-jozsa no console/page errors`);
}

await browser.close();
console.log(fail === 0 ? `\nPASS — all physics invariants hold` : `\nFAILED — ${fail} invariant(s)`);
process.exit(fail === 0 ? 0 : 1);
