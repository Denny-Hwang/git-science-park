# 코딩 표준 (Coding Standards)

Git Science Park의 모든 코드는 본 문서의 규칙을 따른다. 목적은 단 하나다. **외부 도구 없이도 누구나 읽고, 고치고, 오프라인에서 실행할 수 있는 코드**를 유지하는 것이다. 과학사의 핵심 실험 53개(8개 카테고리)를 "조작 → 관찰 → 해석"으로 다루는 인터랙티브 학습 플랫폼이라는 특성상, 각 실험 페이지는 수년 뒤에도 빌드 없이 단일 파일로 살아남아야 한다.

---

## 1. 일반 원칙

| 원칙 | 의미 |
| --- | --- |
| **Zero Dependencies** | npm, CDN, 프레임워크, 빌드 도구, 트랜스파일러를 일절 도입하지 않는다. 브라우저에 내장된 HTML5 / CSS3 / Vanilla JS(ES6+) / Canvas API / SVG 만 사용한다. |
| **자기완결적 단일 HTML** | 각 실험은 `src/experiments/{category}/{slug}.html` 단일 파일 안에 마크업·스타일·스크립트를 모두 담는다. 다른 실험 파일에 의존하지 않으며, 파일 하나만 열어도 완전히 동작한다. |
| **오프라인 우선** | 네트워크 호출(외부 URL fetch, 외부 폰트, 외부 이미지 등) 없이 실행되어야 한다. 데이터가 필요하면 페이지 내부에 인라인하거나 정적 자산으로 동봉한다. |
| **가독성 우선** | "영리한" 한 줄보다 의도가 분명한 여러 줄을 택한다. 최적화는 측정 후에만 한다. |
| **접근성 기본값** | 접근성은 옵션이 아니라 출발점이다. 키보드 조작, 색 대비, 모션 민감성, 대체 텍스트를 처음부터 고려한다. |
| **반응형 기본값** | 모바일/태블릿/데스크톱 모두에서 사용 가능해야 한다. 모바일 우선으로 설계한다. |

> 새 라이브러리가 정말 필요하다고 느껴지면, 99%는 바닐라로 충분하다. 도입 대신 먼저 이슈로 논의한다.

---

## 2. HTML

- **문서 언어**: 루트에 `<html lang="ko">`를 명시한다.
- **시맨틱 태그**: `<header> <main> <nav> <section> <article> <aside> <footer>` 등 의미 있는 태그를 우선한다. `<div>`/`<span>`은 의미가 없는 레이아웃 용도로만 쓴다.
- **필수 메타 태그**: 모든 페이지는 아래 예시의 `charset`, `viewport`, `description`, `title`을 포함한다.
- **들여쓰기**: 공백 2칸. 탭 금지.
- **속성 따옴표**: 항상 큰따옴표(`"`).
- **부울 속성**: `disabled`, `hidden` 등은 값 없이 쓴다(`<button disabled>`).

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="에라토스테네스가 그림자 각도로 지구 둘레를 측정한 방법을 직접 조작하며 배운다.">
  <title>에라토스테네스의 지구 둘레 측정 · Git Science Park</title>
</head>
<body>
  <main>
    <h1>에라토스테네스의 지구 둘레 측정</h1>
  </main>
</body>
</html>
```

### 2.1 탭 구조

각 실험 페이지는 정확히 3개의 탭으로 구성한다. 탭은 시맨틱하게 표시하고 ARIA 역할을 부여한다.

| 탭 | 라벨 | 내용 |
| --- | --- | --- |
| 인터랙티브 | 🎮 인터랙티브 | 조작 가능한 시뮬레이션(Canvas/SVG/입력 컨트롤) |
| 원리 학습 | 📚 원리 학습 | 실험이 보여주는 과학 원리·수식 설명 |
| 역사적 맥락 | 📜 역사적 맥락 | 인물·시대·발견의 의의 |

```html
<div role="tablist" aria-label="실험 보기 모드">
  <button role="tab" id="tab-sim" aria-controls="panel-sim" aria-selected="true">🎮 인터랙티브</button>
  <button role="tab" id="tab-theory" aria-controls="panel-theory" aria-selected="false">📚 원리 학습</button>
  <button role="tab" id="tab-history" aria-controls="panel-history" aria-selected="false">📜 역사적 맥락</button>
</div>
<section role="tabpanel" id="panel-sim" aria-labelledby="tab-sim"><!-- ... --></section>
```

---

## 3. CSS

- **카테고리 테마는 CSS 변수로**: 색상·간격·반경 등 토큰을 `:root`에 정의하고 재사용한다. 카테고리별 대표 색(아래 표)을 `--theme-color`에 주입하면 페이지 전체 톤이 바뀐다.
- **네이밍은 BEM 유사 규칙**: `block__element--modifier`. 예: `panel__title`, `slider--disabled`.
- **반응형은 모바일 우선**: 기본 스타일은 작은 화면 기준으로 작성하고, `min-width` 미디어 쿼리로 키운다.
- **단위 컨벤션**:
  - 글꼴·간격: `rem`(루트 기준). 미세 조정은 `em`.
  - 레이아웃 너비: `%`, `fr`, `vw/vh`, `clamp()`.
  - 테두리/1px 선: `px` 허용.
- **색상 컨벤션**: 16진수 소문자(`#2b6cb0`) 또는 `rgb()/hsl()`. 테마 색은 변수로만 참조하고 하드코딩하지 않는다.
- **들여쓰기**: 2칸. 선언마다 세미콜론. 속성-값 사이 한 칸(`color: #fff;`).

```css
:root {
  --theme-color: #8b4513;     /* 카테고리별 주입 */
  --color-bg: #ffffff;
  --color-text: #1a202c;
  --space-1: 0.5rem;
  --space-2: 1rem;
  --radius: 8px;
  --font-base: 1rem;
}

.panel {
  padding: var(--space-2);
  color: var(--color-text);
}

.panel__title {
  font-size: var(--font-base);
  color: var(--theme-color);
}

/* 모바일 우선: 기본은 1열, 넓어지면 2열 */
.experiment-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2);
}

@media (min-width: 768px) {
  .experiment-layout {
    grid-template-columns: 360px 1fr;
  }
}
```

### 3.1 카테고리 테마 색

| 카테고리 폴더 | 이름 | 색상 |
| --- | --- | --- |
| `01-ancient` | 🏛️ 고대 | `#8B4513` |
| `02-scientific-revolution` | 🔭 과학혁명 | `#2E4A62` |
| `03-precision-era` | ⚗️ 18세기 | `#4A5568` |
| `04-energy-field` | 🔥 19세기 | `#C53030` |
| `05-atomic` | ⚛️ 원자의 시대 | `#2B6CB0` |
| `06-quantum` | 🌊 양자역학 | `#6B46C1` |
| `07-relativity` | 🌌 상대성·우주론 | `#1A365D` |
| `08-modern` | 🔬 현대 물리학 | `#234E52` |

---

## 4. JavaScript

- **ES6+만 사용**: `const`/`let`(절대 `var` 아님), 화살표 함수, 템플릿 리터럴, 구조 분해, `for...of` 등.
- **전역 오염 금지**: 모든 코드는 IIFE 또는 모듈 패턴으로 캡슐화한다. 페이지가 `window`에 노출하는 식별자는 최소화한다(이상적으로 0개).
- **네이밍**:
  - 변수·함수: `camelCase` (`shadowAngle`, `drawScene`).
  - 상수(고정 설정): `UPPER_SNAKE_CASE` (`const EARTH_RADIUS_KM = 6371;`).
  - 생성자/클래스: `PascalCase`.
- **Canvas는 `draw()`로 분리**: 상태 계산 로직과 렌더링을 섞지 않는다. 상태는 객체로 두고, `draw()`는 그 상태를 화면에 그리기만 한다. 애니메이션은 `requestAnimationFrame`을 쓴다.
- **이벤트 위임**: 동적/반복 요소는 컨테이너에 핸들러 하나를 달아 위임한다. 요소마다 리스너를 붙이지 않는다.
- **주석은 '왜'를 설명**: 코드가 *무엇을* 하는지는 코드가 말한다. 주석은 *왜* 그렇게 했는지(공식의 출처, 트레이드오프, 함정)를 적는다.

```javascript
// 좋음: 모듈 패턴으로 전역을 더럽히지 않고, 상태와 렌더를 분리한다.
const EratosthenesSim = (() => {
  'use strict';

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');

  // 시뮬레이션 상태 (단일 진실 공급원)
  const state = { shadowAngle: 7.2, distanceKm: 800 };

  // 그리스 측정값 기준: 7.2도가 둘레의 1/50이라는 관찰에서 출발한다.
  const computeCircumference = (angleDeg, distanceKm) =>
    distanceKm * (360 / angleDeg);

  // draw()는 상태를 화면에 옮기기만 한다. 계산은 하지 않는다.
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... state를 사용해 그림자/태양/도시를 렌더링 ...
  };

  // 이벤트 위임: 컨트롤 패널 하나에만 리스너를 붙인다.
  document.getElementById('controls').addEventListener('input', (e) => {
    if (e.target.matches('[data-param="angle"]')) {
      state.shadowAngle = Number(e.target.value);
      draw();
    }
  });

  draw();
  return { computeCircumference };
})();
```

```javascript
// 나쁨: var, 전역 함수, 매직 넘버, 요소마다 리스너, 계산과 렌더 혼합
var angle = 7.2;
function go() {                              // window.go 로 전역 노출됨
  var c = 800 * (360 / angle);              // 800이 무엇인지 알 수 없음
  document.getElementById('out').innerHTML = c;
  ctx.clearRect(0, 0, 500, 500);            // 계산과 렌더가 한 함수에 섞임
}
document.querySelectorAll('.btn').forEach(function (b) {
  b.onclick = go;                           // 버튼마다 리스너 부착
});
```

---

## 5. 파일/폴더 네이밍

- **모든 경로는 소문자 케밥-케이스**: 공백·대문자·언더스코어 금지.
- **카테고리 폴더**: `src/experiments/{category}/` — 카테고리 id는 `01-ancient` … `08-modern` 형식(2자리 번호 + 영문 슬러그).
- **실험 파일**: `src/experiments/{category}/{slug}.html`
  - `slug` = 카테고리별로 `01`부터 시작하는 2자리 일련번호 + 영문 슬러그.
  - 예: `src/experiments/01-ancient/01-eratosthenes.html`
- **허브에서의 링크 경로**: `./experiments/{category}/{slug}.html`
- **고정 위치**:
  - 허브: `src/index.html`
  - 메타데이터: `src/data/experiments.json`
- 실험 총 **53개**, 카테고리 **8개**(고대 4, 과학혁명 7, 18세기 5, 19세기 7, 원자의 시대 9, 양자역학 7, 상대성·우주론 7, 현대 물리학 7). 새 실험을 추가할 때 이 분포를 깨지 않는다.

---

## 6. experiments.json 편집 규칙

`src/data/experiments.json`은 허브가 카드를 렌더링하는 단일 데이터 소스다. 다음 규칙을 엄격히 지킨다.

### 6.1 실험 엔트리 스키마

| 필드 | 타입 | 규칙 |
| --- | --- | --- |
| `id` | number | **전 실험에서 유일**. 1부터의 정수. |
| `slug` | string | 파일명과 일치(`01-eratosthenes`). 카테고리 내 유일. |
| `category` | string | 8개 카테고리 id 중 하나(`01-ancient` … `08-modern`). |
| `title` | string | 한국어 제목. |
| `titleEn` | string | 영문 제목. |
| `year` | string | 연도/시기(예: `"기원전 240년경"`). |
| `scientist` | string | 인물명. |
| `difficulty` | number | **1~5**(⭐ ~ ⭐⭐⭐⭐⭐). |
| `description` | string | 한 문장 요약. |
| `keywords` | string[] | 검색용 키워드 배열. |
| `status` | string | **`ready` \| `planned` \| `in-progress` 만 허용.** |

### 6.2 편집 시 점검 사항

- **스키마 준수**: 위 필드 외의 키를 임의로 추가하지 않는다.
- **`id` 유일성**: 새 엔트리는 기존 최대 `id` + 1을 쓴다. 중복 금지.
- **`category` 유효성**: 정의된 8개 id 중 하나여야 하며, 파일이 실제로 같은 폴더에 존재해야 한다.
- **`status` 값 제한**: 세 값 외 금지. 현재 모든 실험은 미구현 단계이므로 `status: "planned"`이며, 허브에서 "준비중"으로 비활성 표시된다. 실제 페이지가 완성되면 `ready`로 올린다.
- **유효한 JSON 유지**: 후행 콤마 금지, 큰따옴표 사용, 저장 후 브라우저에서 허브가 정상 파싱되는지 확인.
- **링크 일관성**: `category` + `slug` 조합이 `./experiments/{category}/{slug}.html` 경로와 정확히 대응해야 한다.

```json
{
  "id": 1,
  "slug": "01-eratosthenes",
  "category": "01-ancient",
  "title": "에라토스테네스의 지구 둘레 측정",
  "titleEn": "Eratosthenes Measures the Earth",
  "year": "기원전 240년경",
  "scientist": "에라토스테네스",
  "difficulty": 1,
  "description": "두 도시의 그림자 각도 차이로 지구의 둘레를 계산한다.",
  "keywords": ["지구 둘레", "그림자", "각도", "기하학", "측정"],
  "status": "planned"
}
```

---

## 7. 접근성 / 성능 체크리스트

새 실험을 머지하기 전 아래를 모두 확인한다.

### 7.1 접근성

- [ ] **색 대비**: 본문 텍스트는 배경 대비 최소 4.5:1, 큰 텍스트는 3:1을 만족한다.
- [ ] **색만으로 정보 전달 금지**: 상태/구분은 색 + 텍스트/아이콘/패턴을 병행한다.
- [ ] **키보드 조작**: 모든 인터랙티브 요소(탭, 슬라이더, 버튼)를 키보드만으로 사용할 수 있고, 포커스 표시가 보인다.
- [ ] **`prefers-reduced-motion`**: 모션 민감 사용자를 위해 애니메이션을 줄이거나 끈다.
- [ ] **이미지 대체 텍스트**: 의미 있는 `<img>`에는 `alt`를, 장식용에는 `alt=""`를 준다.
- [ ] **Canvas 대체 설명**: `<canvas>` 안에 시뮬레이션 내용을 글로 설명하는 대체 콘텐츠를 넣고, 핵심 수치는 텍스트로도 노출한다.
- [ ] **ARIA**: 탭/패널 등에 적절한 `role`과 `aria-*`를 부여한다.

```css
/* 모션 민감 사용자 배려 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```html
<!-- Canvas 대체 설명: 그래픽을 못 보는 사용자도 결과를 안다 -->
<canvas id="stage" width="600" height="400" role="img"
        aria-label="태양 광선과 두 도시의 그림자 각도를 보여주는 시뮬레이션">
  현재 그림자 각도는 <span id="alt-angle">7.2</span>도이며,
  계산된 지구 둘레는 <span id="alt-circ">40,000</span> km입니다.
</canvas>
```

### 7.2 성능

- [ ] **애니메이션은 `requestAnimationFrame`**: `setInterval`로 그리지 않는다.
- [ ] **DOM 접근 최소화**: 루프 안에서 반복 조회하지 말고 참조를 캐시한다.
- [ ] **리스너 정리**: 탭 전환/페이지 이탈 시 불필요한 `rAF` 루프를 멈춘다.
- [ ] **자산 경량화**: 외부 폰트·대형 이미지 대신 시스템 폰트와 SVG/Canvas를 우선한다.
- [ ] **레이아웃 스래싱 회피**: 읽기(측정)와 쓰기(스타일 변경)를 분리한다.

---

## 8. 포매팅 규칙

| 항목 | 규칙 |
| --- | --- |
| 들여쓰기 | 공백 **2칸**(HTML/CSS/JS/JSON 공통). 탭 금지. |
| 세미콜론 | JS 문장 끝에 **항상** 붙인다. |
| 따옴표 | JS·JSON: **큰따옴표** 우선(JSON은 큰따옴표 필수). HTML 속성: 큰따옴표. 문자열 안에 큰따옴표가 있으면 작은따옴표로 감싸도 됨. |
| 줄 끝 공백 | 제거. |
| 파일 끝 | 개행 1개로 끝낸다. |
| 줄 길이 | 권장 100자 이내. 가독성을 해치면 줄바꿈. |

### 8.1 린트/포매팅 도구 정책

Zero Dependencies 원칙에 따라 **별도의 린터·포매터를 설치하지 않는다.** 대신:

- **에디터 기본 기능**을 사용한다(예: `.editorconfig`로 들여쓰기 2칸·줄 끝 LF·끝 개행을 강제).
- 저장 시 자동 포맷이 켜져 있다면 위 규칙과 일치하도록 에디터를 설정한다.
- JSON은 저장 전 에디터의 기본 "JSON 유효성 검사"로 문법 오류를 확인한다.
- 외부 npm 의존(eslint, prettier 등)을 `package.json`에 추가하지 않는다. 규칙은 본 문서와 코드 리뷰로 강제한다.

권장 `.editorconfig` 예:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

---

## 9. 요약 (한눈에 보기)

- 외부 의존성 0개, 실험 1개 = 단일 HTML, 오프라인 동작.
- `<html lang="ko">`, 시맨틱 태그, 메타 태그 필수, 들여쓰기 2칸.
- CSS 변수로 카테고리 테마, BEM 유사 네이밍, 모바일 우선 반응형.
- JS는 ES6+, IIFE/모듈로 전역 차단, `camelCase`, `draw()` 분리, 이벤트 위임, '왜' 주석.
- 경로는 소문자 케밥, 파일은 `{slug}.html`, 데이터는 `experiments.json` 스키마 준수.
- 접근성·성능 체크리스트 통과 후 머지.
- 린터 없이 `.editorconfig` + 코드 리뷰로 일관성 유지.

이 표준을 지키면, 10년 뒤에도 실험 파일 하나만 더블클릭하면 그대로 돌아간다. 그것이 Git Science Park가 추구하는 것이다.
