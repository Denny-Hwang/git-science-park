# 실험 HTML 템플릿 표준 규격 (Experiment Template)

> Git Science Park의 모든 실험 페이지는 **단일 HTML 파일**로, 외부 라이브러리·빌드 도구 없이(Zero Dependencies) 그 자체로 오프라인 실행이 가능해야 한다. 이 문서는 53개 실험이 일관된 구조·테마·상호작용 패턴을 갖도록 강제하는 표준 규격이다.

- 기술 스택: HTML5 + CSS3 + Vanilla JavaScript(ES6+), Canvas API(2D), SVG(다이어그램)
- 모든 스타일/스크립트는 **파일 내부에 inline** (`<style>`, `<script>`). 외부 CSS/JS 참조 금지.
- 반응형: 모바일 / 태블릿 / 데스크톱 모두 지원.
- 브라우저: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (IE 미지원).
- 한국어 UI를 기본으로 하되 영문 고유명사·공식·식별자는 영문 유지.

---

## 1. 파일 명명 규칙

실험 페이지는 카테고리 폴더 아래에 위치한다.

```
src/experiments/{category}/{slug}.html
```

- `{category}` : 8개 카테고리 ID 중 하나 (`01-ancient` … `08-modern`).
- `{slug}` : `NN-영문슬러그` 형태. `NN`은 **카테고리별로 01부터 시작하는 2자리 일련번호**, 영문 슬러그는 소문자·하이픈(kebab-case).

| 항목 | 예시 |
|------|------|
| 파일 경로 | `src/experiments/01-ancient/01-eratosthenes.html` |
| 허브에서의 링크 | `./experiments/01-ancient/01-eratosthenes.html` |
| 메타데이터 등록 | `src/data/experiments.json` |

### 8개 카테고리 ID와 테마 색상

| ID | 이름 | 영문 | 아이콘 | `--primary` | 실험 수 |
|----|------|------|--------|-------------|---------|
| `01-ancient` | 고대 | Ancient | 🏛️ | `#8B4513` | 4 |
| `02-scientific-revolution` | 과학혁명 | Scientific Revolution | 🔭 | `#2E4A62` | 7 |
| `03-precision-era` | 18세기 | Precision Era | ⚗️ | `#4A5568` | 5 |
| `04-energy-field` | 19세기 | Energy & Field | 🔥 | `#C53030` | 7 |
| `05-atomic` | 원자의 시대 | Atomic Age | ⚛️ | `#2B6CB0` | 9 |
| `06-quantum` | 양자역학 | Quantum Mechanics | 🌊 | `#6B46C1` | 7 |
| `07-relativity` | 상대성·우주론 | Relativity & Cosmology | 🌌 | `#1A365D` | 7 |
| `08-modern` | 현대 물리학 | Modern Physics | 🔬 | `#234E52` | 7 |

> 총 53개. 새 실험은 해당 카테고리의 마지막 일련번호 다음 값을 사용한다.

---

## 2. HTML 필수 구조

모든 실험 파일은 아래 골격을 반드시 포함한다. 순서·요소 ID는 고정이다(전환 JS와 CSS가 ID/클래스에 의존).

```
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{실험명} · Git Science Park</title>
    <style> … 내부 스타일(테마 변수 포함) … </style>
  </head>
  <body>
    <nav>            ← 뒤로가기(허브로) + 카테고리 배지
    <header>         ← 제목 / 영문명 / 메타(연도·과학자)
    <div class="tabs">   ← 3개 탭 버튼
    <main>
      <div id="interactive" class="tab-content active"> … 🎮 인터랙티브 …
      <div id="learning"    class="tab-content">        … 📚 원리 학습 …
      <div id="history"     class="tab-content">        … 📜 역사적 맥락 …
    </main>
    <footer>
    <script> … 내부 스크립트(탭/슬라이더/Canvas/퀴즈) … </script>
  </body>
</html>
```

### 필수 요소 체크리스트

| 영역 | 필수 요소 |
|------|-----------|
| `<head>` | `DOCTYPE`, `html lang="ko"`, `meta charset="UTF-8"`, `meta viewport`, `<title>`, 내부 `<style>` |
| `<nav>` | 허브로 돌아가는 뒤로가기 링크(`../../index.html`), 카테고리 표시 배지 |
| `<header>` | 한글 제목(`h1`), 영문명, 메타데이터(연도, 과학자) |
| `.tabs` | 3개 탭 버튼: `🎮 인터랙티브` / `📚 원리 학습` / `📜 역사적 맥락` |
| 탭 컨텐츠 | `#interactive`, `#learning`, `#history` (각 `.tab-content`) |
| `<footer>` | 저작/출처 또는 허브 복귀 안내 |
| `<script>` | 탭 전환, 슬라이더 이벤트, `draw()`, 퀴즈 채점 |

---

## 3. 🎮 인터랙티브 탭 필수 요소

| 요소 | 클래스/태그 | 역할 |
|------|------------|------|
| 시각화 영역 | `<canvas>` 또는 `.viz-container` | 2D 시뮬레이션 렌더링 |
| 조작 패널 | `.controls` | 슬라이더(`<input type="range">`), 버튼 |
| 계산 결과 | `.result-box` | 입력값으로 계산된 결과 실시간 표시 |
| 관찰 포인트 | `.hint-box` | "무엇을 보아야 하는가" 안내 |

**상호작용 흐름(조작 → 관찰 → 해석):** 슬라이더 `input` 이벤트 → 값 갱신 → `draw()` 재호출 → `.result-box` 갱신.

---

## 4. 📚 원리 학습 탭 필수 요소

| 요소 | 클래스/태그 | 역할 |
|------|------------|------|
| 학습 목표 | `<ul>` | 이 실험에서 배우는 것 3~5개 |
| 핵심 개념 | `.concept-box` | 원리 설명 |
| 공식 | `.formula-box` | 수식(텍스트/유니코드) |
| 다이어그램 | inline `<svg>` | 개념 시각화 |
| 오개념 | `.misconception` | 흔한 오해와 정정 |
| 퀴즈 | `.quiz-box` | 객관식 1~2문제 + 채점 |

---

## 5. 📜 역사적 맥락 탭 필수 요소

| 요소 | 클래스/태그 | 역할 |
|------|------------|------|
| 과학자 소개 | `.scientist` | 인물·업적 |
| 시대 배경 | `.timeline` | 연표(연도-사건) |
| 과학사적 의의 | `.key-point` | 이 실험이 과학사에 남긴 의미 |

---

## 6. CSS 변수 (카테고리별 테마)

각 실험은 카테고리 색상을 `:root`의 CSS 변수로 정의한다. 카테고리만 바꾸면 색상이 일괄 적용되도록 한다.

```css
:root {
  --primary:       #8B4513;   /* 카테고리 대표색 (위 표 참조) */
  --primary-light: #b5703a;   /* 호버/강조 — primary를 밝게 */
  --bg:            #f7f5f2;   /* 페이지 배경 */
  --card-bg:       #ffffff;   /* 카드/박스 배경 */
  --text:          #1a1a1a;   /* 본문 텍스트 */
  --text-muted:    #6b7280;   /* 보조 텍스트 */
}
```

| 변수 | 의미 |
|------|------|
| `--primary` | 카테고리 대표색 (탭/버튼/제목 강조) |
| `--primary-light` | 호버·활성 강조용 밝은 변형 |
| `--bg` | 페이지 배경 |
| `--card-bg` | 카드·박스 배경 |
| `--text` | 본문 텍스트 |
| `--text-muted` | 보조/메타 텍스트 |

> 새 실험을 만들 때는 위 표의 `--primary`만 카테고리에 맞게 바꾸고, `--primary-light`는 적절히 밝게 조정한다.

---

## 7. JavaScript 패턴

핵심 4가지 패턴은 모든 실험에서 동일하게 재사용한다.

**(1) 탭 전환** — 버튼의 `data-tab`으로 대상 `.tab-content`를 토글한다.

```js
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});
```

**(2) 슬라이더 이벤트** — `input` 시 값 표시 + 결과 갱신 + 다시 그리기.

```js
slider.addEventListener('input', () => {
  state.value = Number(slider.value);
  updateResult();
  draw();
});
```

**(3) Canvas `draw()`** — 매 호출마다 캔버스를 지우고 현재 상태를 다시 그린다(순수 함수처럼 `state`만 읽음).

```js
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // state를 읽어 도형/축/주석을 그린다
}
```

**(4) 퀴즈 채점** — 선택지 비교 후 정/오 피드백 표시.

```js
function gradeQuiz() {
  const picked = document.querySelector('input[name="q1"]:checked');
  const out = document.getElementById('quiz-feedback');
  if (!picked) { out.textContent = '답을 선택하세요.'; return; }
  out.textContent = picked.value === 'correct' ? '정답입니다! 🎉' : '다시 생각해 보세요.';
}
```

---

## 8. 보일러플레이트 (복사용 완성형 예시)

아래는 위 규격을 그대로 따르는 **실제로 동작하는 최소 실험 HTML 한 벌**이다.
예시 실험은 `01-ancient` 카테고리의 **에라토스테네스의 지구 둘레 측정**(`01-eratosthenes`)이며,
슬라이더(그림자 각도, 두 도시 거리)를 움직이면 Canvas가 갱신되고 `result-box`에 추정 지구 둘레가 실시간 계산된다. 그대로 복사한 뒤 내용을 교체하면 된다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>에라토스테네스의 지구 둘레 측정 · Git Science Park</title>
  <style>
    :root {
      --primary: #8B4513;
      --primary-light: #b5703a;
      --bg: #f7f5f2;
      --card-bg: #ffffff;
      --text: #1a1a1a;
      --text-muted: #6b7280;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", "Noto Sans KR", sans-serif;
      background: var(--bg); color: var(--text); line-height: 1.6;
    }
    nav {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; background: var(--card-bg);
      border-bottom: 1px solid #e5e7eb;
    }
    nav a { color: var(--primary); text-decoration: none; font-weight: 600; }
    nav a:hover { color: var(--primary-light); }
    .cat-badge {
      margin-left: auto; padding: 4px 12px; border-radius: 999px;
      background: var(--primary); color: #fff; font-size: 0.85rem;
    }
    header {
      max-width: 880px; margin: 0 auto; padding: 28px 20px 12px;
    }
    header h1 { font-size: 1.8rem; color: var(--primary); }
    header .en { color: var(--text-muted); font-style: italic; }
    header .meta { margin-top: 6px; font-size: 0.9rem; color: var(--text-muted); }
    .tabs {
      max-width: 880px; margin: 16px auto 0; padding: 0 20px;
      display: flex; gap: 8px; border-bottom: 2px solid #e5e7eb;
    }
    .tab-btn {
      padding: 10px 16px; border: none; background: none; cursor: pointer;
      font-size: 1rem; color: var(--text-muted); border-bottom: 3px solid transparent;
    }
    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 700; }
    main { max-width: 880px; margin: 0 auto; padding: 20px; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    canvas {
      width: 100%; max-width: 520px; height: auto; display: block; margin: 0 auto;
      background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
    }
    .controls {
      margin: 16px 0; padding: 16px; background: var(--card-bg);
      border-radius: 8px; border: 1px solid #e5e7eb;
    }
    .controls label { display: block; margin-bottom: 6px; font-weight: 600; }
    .controls input[type="range"] { width: 100%; accent-color: var(--primary); }
    .result-box, .hint-box, .concept-box, .formula-box,
    .misconception, .quiz-box, .timeline, .key-point, .scientist {
      padding: 14px 16px; border-radius: 8px; margin: 12px 0;
    }
    .result-box { background: #fff7ed; border-left: 4px solid var(--primary); font-size: 1.05rem; }
    .result-box strong { color: var(--primary); }
    .hint-box { background: #eff6ff; border-left: 4px solid #2563eb; }
    .concept-box { background: var(--card-bg); border: 1px solid #e5e7eb; }
    .formula-box {
      background: #1e1e1e; color: #f4f4f4; font-family: "Courier New", monospace;
      text-align: center; font-size: 1.1rem;
    }
    .misconception { background: #fef2f2; border-left: 4px solid #dc2626; }
    .quiz-box { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .quiz-box label { display: block; margin: 6px 0; cursor: pointer; }
    .quiz-box button {
      margin-top: 10px; padding: 8px 18px; border: none; border-radius: 6px;
      background: var(--primary); color: #fff; cursor: pointer; font-size: 0.95rem;
    }
    .quiz-box button:hover { background: var(--primary-light); }
    #quiz-feedback { margin-top: 10px; font-weight: 600; }
    .timeline { background: var(--card-bg); border: 1px solid #e5e7eb; }
    .timeline li { margin-left: 18px; }
    .key-point { background: #fffbeb; border-left: 4px solid #d97706; }
    .scientist { background: var(--card-bg); border: 1px solid #e5e7eb; }
    ul.goals { margin: 12px 0 12px 22px; }
    footer {
      max-width: 880px; margin: 24px auto; padding: 16px 20px;
      color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid #e5e7eb;
    }
    svg { display: block; margin: 12px auto; max-width: 100%; }
  </style>
</head>
<body>
  <!-- NAV: 허브로 돌아가기 + 카테고리 배지 -->
  <nav>
    <a href="../../index.html">&larr; 허브로</a>
    <span class="cat-badge">🏛️ 고대 (Ancient)</span>
  </nav>

  <!-- HEADER: 제목 / 영문명 / 메타(연도·과학자) -->
  <header>
    <h1>에라토스테네스의 지구 둘레 측정</h1>
    <div class="en">Eratosthenes' Measurement of Earth's Circumference</div>
    <div class="meta">기원전 240년경 · 에라토스테네스 (Eratosthenes) · 난이도 ⭐⭐</div>
  </header>

  <!-- TABS -->
  <div class="tabs">
    <button class="tab-btn active" data-tab="interactive">🎮 인터랙티브</button>
    <button class="tab-btn" data-tab="learning">📚 원리 학습</button>
    <button class="tab-btn" data-tab="history">📜 역사적 맥락</button>
  </div>

  <main>
    <!-- ===== 🎮 인터랙티브 ===== -->
    <div id="interactive" class="tab-content active">
      <canvas id="canvas" width="520" height="360"></canvas>

      <div class="controls">
        <label for="angle">알렉산드리아의 그림자 각도: <span id="angle-val">7.2</span>°</label>
        <input type="range" id="angle" min="1" max="20" step="0.1" value="7.2">

        <label for="dist" style="margin-top:12px;">두 도시 간 거리: <span id="dist-val">925</span> km</label>
        <input type="range" id="dist" min="500" max="1500" step="5" value="925">
      </div>

      <div class="result-box" id="result">
        추정 지구 둘레: <strong>—</strong>
      </div>

      <div class="hint-box">
        💡 <strong>관찰 포인트:</strong> 같은 시각, 시에네에서는 해가 우물 바닥까지 곧장 비쳐 그림자가 없다.
        알렉산드리아 막대의 그림자 각도가 곧 두 도시 사이 지구 중심각이다. 각도를 키우면 추정 둘레가
        어떻게 변하는지 확인하라.
      </div>
    </div>

    <!-- ===== 📚 원리 학습 ===== -->
    <div id="learning" class="tab-content">
      <h2>학습 목표</h2>
      <ul class="goals">
        <li>그림자 각도와 지구 중심각이 같음을 이해한다.</li>
        <li>비례식으로 전체 둘레를 추정하는 방법을 익힌다.</li>
        <li>단순한 관측으로 거대한 양을 추론하는 과학적 사고를 경험한다.</li>
      </ul>

      <div class="concept-box">
        <h3>핵심 개념</h3>
        <p>두 도시에서 동시에 측정한 태양 입사각의 차이는 지구 중심에서 본 두 지점의 중심각과 같다.
        이 각도가 360°에 대해 차지하는 비율은, 두 도시 사이 거리가 전체 둘레에서 차지하는 비율과 같다.</p>
      </div>

      <div class="formula-box">
        C = 360° / θ × d
      </div>

      <!-- SVG 다이어그램 -->
      <svg width="320" height="200" viewBox="0 0 320 200" role="img" aria-label="지구와 두 도시의 그림자 각 다이어그램">
        <circle cx="160" cy="120" r="70" fill="none" stroke="#8B4513" stroke-width="2"/>
        <line x1="160" y1="120" x2="120" y2="62" stroke="#6b7280" stroke-width="1.5"/>
        <line x1="160" y1="120" x2="200" y2="62" stroke="#6b7280" stroke-width="1.5"/>
        <line x1="120" y1="62" x2="120" y2="20" stroke="#d97706" stroke-width="2"/>
        <line x1="200" y1="62" x2="200" y2="20" stroke="#d97706" stroke-width="2"/>
        <text x="92"  y="58" font-size="11">알렉산드리아</text>
        <text x="186" y="58" font-size="11">시에네</text>
        <text x="150" y="116" font-size="11" fill="#8B4513">θ</text>
      </svg>

      <div class="misconception">
        <strong>흔한 오개념:</strong> "지구가 평평하다면 두 도시의 그림자 각도가 같을 것"이라 생각하기 쉽다.
        실제로는 두 도시의 그림자 각도가 <em>다르다</em>는 사실 자체가 지구가 둥글다는 증거다.
      </div>

      <div class="quiz-box">
        <h3>퀴즈</h3>
        <p>그림자 각도 θ가 7.2°이고 두 도시 거리가 925 km일 때, 추정 둘레에 가장 가까운 값은?</p>
        <label><input type="radio" name="q1" value="wrong"> 약 9,250 km</label>
        <label><input type="radio" name="q1" value="correct"> 약 46,250 km</label>
        <label><input type="radio" name="q1" value="wrong"> 약 92,500 km</label>
        <button type="button" onclick="gradeQuiz()">채점하기</button>
        <div id="quiz-feedback"></div>
      </div>
    </div>

    <!-- ===== 📜 역사적 맥락 ===== -->
    <div id="history" class="tab-content">
      <div class="scientist">
        <h3>과학자: 에라토스테네스 (Eratosthenes, 기원전 276~194)</h3>
        <p>고대 그리스의 수학자·지리학자·천문학자로 알렉산드리아 도서관의 관장을 지냈다.
        소수를 걸러내는 "에라토스테네스의 체(Sieve of Eratosthenes)"로도 유명하다.</p>
      </div>

      <div class="timeline">
        <h3>시대 배경</h3>
        <ul>
          <li>기원전 3세기 — 헬레니즘 시대, 알렉산드리아가 학문의 중심지로 부상</li>
          <li>기원전 240년경 — 하짓날 정오 시에네의 우물 관측을 단서로 지구 둘레 추정</li>
          <li>이후 — 측지학(geodesy)의 출발점으로 자리매김</li>
        </ul>
      </div>

      <div class="key-point">
        <strong>과학사적 의의:</strong> 직접 측정이 불가능한 거대한 양을, 단순한 기하학과
        두 지점의 관측만으로 추정해낸 최초의 정량적 지구과학 실험이다. 오차 약 2~16%로
        놀라울 만큼 정확했다.
      </div>
    </div>
  </main>

  <footer>
    Git Science Park · 과학사 인터랙티브 실험실 — 직접 조작하며 배우는 과학사
  </footer>

  <script>
    // ----- 상태 -----
    const state = { angle: 7.2, dist: 925 };

    // ----- (1) 탭 전환 -----
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });

    // ----- Canvas -----
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // ----- (3) draw(): state만 읽어 다시 그린다 -----
    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2 + 40, R = 110;

      // 지구
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = '#f0e6da';
      ctx.fill();
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 중심각 = 그림자 각도
      const half = (state.angle * Math.PI / 180) / 2;
      const aAng = -Math.PI / 2 - half; // 알렉산드리아
      const sAng = -Math.PI / 2 + half; // 시에네

      // 반지름 선
      [aAng, sAng].forEach((ang) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(ang), cy + R * Math.sin(ang));
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // 햇빛(평행 광선)
      [aAng, sAng].forEach((ang) => {
        const px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - 60);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 라벨
      ctx.fillStyle = '#1a1a1a';
      ctx.font = '12px sans-serif';
      ctx.fillText('알렉산드리아', cx + R * Math.cos(aAng) - 70, cy + R * Math.sin(aAng) - 64);
      ctx.fillText('시에네', cx + R * Math.cos(sAng) + 6, cy + R * Math.sin(sAng) - 64);
      ctx.fillStyle = '#8B4513';
      ctx.fillText('θ = ' + state.angle.toFixed(1) + '°', cx - 16, cy - 6);
    }

    // ----- 결과 계산 -----
    function updateResult() {
      const circumference = (360 / state.angle) * state.dist;
      document.querySelector('#result strong').textContent =
        Math.round(circumference).toLocaleString() + ' km';
    }

    // ----- (2) 슬라이더 이벤트 -----
    const angleSlider = document.getElementById('angle');
    const distSlider = document.getElementById('dist');

    angleSlider.addEventListener('input', () => {
      state.angle = Number(angleSlider.value);
      document.getElementById('angle-val').textContent = state.angle.toFixed(1);
      updateResult();
      draw();
    });
    distSlider.addEventListener('input', () => {
      state.dist = Number(distSlider.value);
      document.getElementById('dist-val').textContent = state.dist;
      updateResult();
      draw();
    });

    // ----- (4) 퀴즈 채점 -----
    function gradeQuiz() {
      const picked = document.querySelector('input[name="q1"]:checked');
      const out = document.getElementById('quiz-feedback');
      if (!picked) { out.textContent = '답을 선택하세요.'; out.style.color = '#6b7280'; return; }
      if (picked.value === 'correct') {
        out.textContent = '정답입니다! 🎉 (360 / 7.2 × 925 ≈ 46,250 km)';
        out.style.color = '#16a34a';
      } else {
        out.textContent = '다시 생각해 보세요. C = 360° / θ × d 입니다.';
        out.style.color = '#dc2626';
      }
    }

    // ----- 초기 렌더 -----
    updateResult();
    draw();
  </script>
</body>
</html>
```

---

## 9. 새 실험 작성 체크리스트

복사한 보일러플레이트를 채울 때 아래를 순서대로 확인한다.

- [ ] 파일을 `src/experiments/{category}/{NN-slug}.html` 경로에 생성했다.
- [ ] `:root`의 `--primary` / `--primary-light`를 해당 카테고리 색으로 교체했다.
- [ ] `<title>`, `<nav>` 카테고리 배지(아이콘+이름)를 교체했다.
- [ ] `<header>`의 한글 제목·영문명·메타(연도·과학자·난이도)를 채웠다.
- [ ] 3개 탭이 모두 비어 있지 않다(인터랙티브 / 학습 / 역사).
- [ ] 인터랙티브: `<canvas>`(또는 `.viz-container`) + `.controls`(슬라이더/버튼) + `.result-box` + `.hint-box`.
- [ ] 학습: 학습 목표 `<ul>` + `.concept-box` + `.formula-box` + inline `<svg>` + `.misconception` + `.quiz-box`(1~2문제).
- [ ] 역사: `.scientist` + `.timeline` + `.key-point`.
- [ ] JS: 탭 전환 / 슬라이더→`draw()`+결과 갱신 / `draw()`가 `state`만 읽음 / 퀴즈 채점이 동작.
- [ ] 외부 CSS·JS·폰트·라이브러리 참조가 없다(Zero Dependencies, 오프라인 실행 가능).
- [ ] 모바일 폭(360px)에서 가로 스크롤 없이 보인다(반응형).
- [ ] `file://`로 직접 열어 슬라이더·탭·퀴즈가 모두 동작함을 확인했다.
- [ ] `src/data/experiments.json`에 메타데이터를 등록했다(`status` 초기값 `planned`, `difficulty` 1~5).
- [ ] `src/index.html` 허브에서 링크(`./experiments/{category}/{slug}.html`)가 노출된다(현재는 `planned`이므로 "준비중" 비활성 표시).
