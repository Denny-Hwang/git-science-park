// tests/a11y.mjs — axe-core 로 WCAG 2 A/AA 위반을 자동 점검한다(허브 + 대표 실험 페이지).
// serious/critical 위반이 있으면 실패. 색약 모드·RTL(아랍어)도 함께 점검한다.
// 개발/CI 전용. 사이트(src/)에는 axe 가 포함되지 않는다.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';

// 대표 표본: 허브 + 카테고리별 실험 1개씩(전부 동일 셸 구조라 표본이면 충분).
const SAMPLE = [
  { url: 'index.html', label: 'hub' },
  { url: 'experiments/01-ancient/01-eratosthenes.html', label: 'eratosthenes' },
  { url: 'experiments/03-precision-era/02-cavendish.html', label: 'cavendish' },
  { url: 'experiments/06-quantum/03-schrodinger.html', label: 'quantum(schrodinger)' },
  { url: 'experiments/06-quantum/09-hydrogen-orbitals.html', label: 'quantum(hydrogen)' },
  { url: 'experiments/09-quantum-computing/01-bloch-sphere.html', label: 'qc(bloch)' },
  { url: 'experiments/09-quantum-computing/03-grover.html', label: 'qc(grover)' }
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const browser = await chromium.launch();
let fail = 0;
let total = 0;

async function scan(label, url, init) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  if (init) await page.addInitScript(init);
  let resp;
  try {
    resp = await page.goto(`${BASE}/${url}`, { waitUntil: 'load', timeout: 20000 });
  } catch (e) {
    console.log(`FAIL  ${label}  navigation: ${e.message.split('\n')[0]}`);
    fail++; await ctx.close(); return;
  }
  if (!resp || resp.status() !== 200) {
    console.log(`FAIL  ${label}  status=${resp && resp.status()}`);
    fail++; await ctx.close(); return;
  }
  await page.waitForTimeout(500);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  total += bad.length;
  if (bad.length) {
    fail++;
    console.log(`FAIL  ${label}  ${bad.length} serious/critical violation(s):`);
    for (const v of bad) {
      console.log(`      [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node(s))`);
      console.log(`        e.g. ${(v.nodes[0] && v.nodes[0].target.join(' ')).slice(0, 100)}`);
    }
  } else {
    const minor = results.violations.length;
    console.log(`ok    ${label}  no serious/critical${minor ? ` (${minor} minor/moderate noted)` : ''}`);
  }
  await ctx.close();
}

for (const s of SAMPLE) await scan(s.label, s.url, null);
// 색약 모드(localStorage)와 RTL(아랍어) 표본
await scan('hub+colorblind', 'index.html', () => localStorage.setItem('gsp:cb', '1'));
await scan('hub+arabic(rtl)', 'index.html', () => localStorage.setItem('gsp:lang', 'ar'));

await browser.close();
console.log(fail === 0
  ? `\nPASS — 0 serious/critical a11y violations across ${SAMPLE.length + 2} scans`
  : `\nFAILED — ${fail} scan(s) with ${total} serious/critical violation(s)`);
process.exit(fail === 0 ? 0 : 1);
