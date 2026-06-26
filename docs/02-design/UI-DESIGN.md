# UI 디자인 가이드 (UI Design)

> Git Science Park — 과학사 인터랙티브 실험실 (Interactive Science History Lab)
>
> 본 문서는 허브와 53개 실험 페이지가 공유하는 시각 언어, 디자인 토큰, 레이아웃 패턴, 접근성 기준을 정의한다. 모든 페이지는 외부 라이브러리 없이 순수 HTML5 + CSS3 + Vanilla JavaScript(ES6+)로 구현되며(Zero Dependencies), 여기서 정의한 CSS 변수와 컴포넌트 규약을 그대로 따른다.

---

## 1. 디자인 원칙

본 플랫폼의 핵심은 "조작 → 관찰 → 해석"의 학습 루프다. 모든 시각 결정은 학습자가 실험의 본질에 집중하도록 돕는 방향으로 내린다.

### 1.1 명료함 (Clarity)
- 화면에서 가장 중요한 것은 **시뮬레이션 결과**다. 장식은 결과를 가리지 않는다.
- 한 화면에 하나의 주제만 담는다. 정보는 위계(타이틀 → 부제 → 본문 → 보조)에 따라 크기와 색으로 명확히 구분한다.
- 숫자/단위/수식은 등폭 폰트와 충분한 여백으로 읽기 쉽게 표시한다.

### 1.2 집중 (Focus)
- 인터랙티브 탭에서는 컨트롤과 캔버스가 시선의 중심에 오도록 배치한다.
- 부가 설명(원리·역사)은 탭으로 분리해 인지 부하를 낮춘다.
- 애니메이션은 의미 전달에 필요한 경우에만 사용하고, 끊임없이 움직이는 요소로 주의를 분산시키지 않는다.

### 1.3 직접 조작 (Direct Manipulation)
- 슬라이더·버튼·드래그로 값을 바꾸면 결과가 **즉시** 반영된다(실시간 피드백).
- 조작 가능한 요소는 시각적으로 명확히 구별된다(커서 변화, 호버/포커스 상태, 충분한 터치 타깃 ≥ 44×44px).
- 되돌리기(리셋) 버튼을 항상 제공해 실험을 자유롭게 반복하도록 한다.

### 1.4 접근성 (Accessibility)
- 색에만 의존하지 않는다(아이콘·텍스트·패턴 병행).
- 키보드만으로 모든 기능을 사용할 수 있다.
- 명암비 WCAG AA 이상, 모션 최소화 옵션 존중, 의미 있는 ARIA 레이블을 부여한다.

---

## 2. 디자인 토큰 (Design Tokens)

모든 토큰은 CSS 사용자 정의 속성(`:root` 변수)으로 선언하고, 컴포넌트는 변수만 참조한다. 색상은 라이트/다크 모드에서 변수 재정의로 전환한다.

### 2.1 카테고리 테마 색상

| ID | 아이콘 | 이름 | 영문명 | 설명 | 색상 |
|---|---|---|---|---|---|
| 01-ancient | 🏛️ | 고대 | Ancient | 측정과 기하학의 탄생 | #8B4513 |
| 02-scientific-revolution | 🔭 | 과학혁명 | Scientific Revolution | 실험과 수학의 결합 | #2E4A62 |
| 03-precision-era | ⚗️ | 18세기 | Precision Era | 정밀 측정의 시대 | #4A5568 |
| 04-energy-field | 🔥 | 19세기 | Energy & Field | 에너지와 장의 시대 | #C53030 |
| 05-atomic | ⚛️ | 원자의 시대 | Atomic Age | 물질의 궁극 구조 | #2B6CB0 |
| 06-quantum | 🌊 | 양자역학 | Quantum Mechanics | 양자역학의 형성 | #6B46C1 |
| 07-relativity | 🌌 | 상대성·우주론 | Relativity & Cosmology | 상대성이론과 우주론 | #1A365D |
| 08-modern | 🔬 | 현대 물리학 | Modern Physics | 극한의 탐험 | #234E52 |

각 카테고리 색상은 해당 카드/섹션의 **색 띠(accent strip)**, 섹션 헤더, 배지 강조에 사용한다. 카테고리 색은 일관성을 위해 `data-category` 속성과 매핑된 CSS 변수로 적용한다.

```css
/* 카테고리별 테마 색상 — data-category 속성으로 선택 적용 */
[data-category="01-ancient"]              { --cat-color: #8B4513; }
[data-category="02-scientific-revolution"]{ --cat-color: #2E4A62; }
[data-category="03-precision-era"]        { --cat-color: #4A5568; }
[data-category="04-energy-field"]         { --cat-color: #C53030; }
[data-category="05-atomic"]               { --cat-color: #2B6CB0; }
[data-category="06-quantum"]              { --cat-color: #6B46C1; }
[data-category="07-relativity"]           { --cat-color: #1A365D; }
[data-category="08-modern"]               { --cat-color: #234E52; }
```

### 2.2 타이포그래피

웹 폰트를 로드하지 않고 OS 기본 시스템 폰트 스택을 사용한다(Zero Dependencies, 빠른 첫 렌더링, 오프라인 동작).

- **본문 스택**: 한국어 가독성을 우선한 시스템 산세리프.
- **모노스페이스 스택**: 숫자·단위·수식·코드 표시용.
- **타입 스케일**: 1.25(Major Third) 비율 기반.

```css
:root {
  /* 폰트 스택 */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI",
               "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR",
               Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "SF Mono", "Cascadia Code", "JetBrains Mono",
               "D2Coding", Consolas, "Liberation Mono", Menlo, monospace;

  /* 타입 스케일 (rem, 1rem = 16px) */
  --fs-xs:   0.75rem;   /* 12px — 캡션, 배지 */
  --fs-sm:   0.875rem;  /* 14px — 보조 텍스트 */
  --fs-base: 1rem;      /* 16px — 본문 */
  --fs-md:   1.25rem;   /* 20px — 카드 제목 */
  --fs-lg:   1.563rem;  /* 25px — 섹션 헤더 */
  --fs-xl:   1.953rem;  /* 31px — 페이지 부제 */
  --fs-2xl:  2.441rem;  /* 39px — 페이지 타이틀 */

  /* 폰트 두께 / 행간 */
  --fw-regular: 400;
  --fw-medium:  500;
  --fw-bold:    700;
  --lh-tight:   1.25;
  --lh-normal:  1.6;
}
```

### 2.3 간격 스케일 (Spacing)

4px 기반 8단계 스케일. 레이아웃·패딩·갭은 모두 이 토큰으로 표현한다.

```css
:root {
  --space-1: 0.25rem;  /*  4px */
  --space-2: 0.5rem;   /*  8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
}
```

### 2.4 반경 / 그림자 (Radius & Shadow)

```css
:root {
  /* 모서리 반경 */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-pill: 999px;  /* 배지·필터 칩 */

  /* 그림자 (라이트 모드 기준) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.10);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.16);

  /* 전환 */
  --transition-fast: 120ms ease;
  --transition-base: 200ms ease;
}
```

### 2.5 라이트 / 다크 모드 변수

색상은 의미(semantic) 변수로 정의하고, 모드별로 값만 교체한다. `prefers-color-scheme`를 기본값으로 두고, `data-theme` 속성으로 수동 토글을 지원한다.

```css
:root {
  /* 라이트 모드 (기본) */
  --color-bg:          #f7f8fa;  /* 페이지 배경 */
  --color-surface:     #ffffff;  /* 카드·패널 배경 */
  --color-surface-alt: #eef1f5;  /* 보조 배경 (result-box 등) */
  --color-border:      #d9dee5;
  --color-text:        #1a1f29;  /* 본문 */
  --color-text-muted:  #5b6472;  /* 보조 텍스트 */
  --color-text-invert: #ffffff;
  --color-accent:      #2b6cb0;  /* 기본 강조 (링크·CTA) */
  --color-accent-hover:#245a96;
  --color-focus-ring:  #2563eb;
  --color-overlay:     rgba(247, 248, 250, 0.72); /* 준비중 오버레이 */
  --color-disabled:    #9aa3b0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:          #0f141b;
    --color-surface:     #1a2230;
    --color-surface-alt: #232d3d;
    --color-border:      #303b4d;
    --color-text:        #e6eaf0;
    --color-text-muted:  #9aa6b8;
    --color-text-invert: #0f141b;
    --color-accent:      #5b9bd5;
    --color-accent-hover:#7ab0e0;
    --color-focus-ring:  #7ab0e0;
    --color-overlay:     rgba(15, 20, 27, 0.72);
    --color-disabled:    #4a5568;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);
  }
}

/* 수동 토글 — data-theme가 자동 감지를 덮어쓴다 */
[data-theme="dark"]  { color-scheme: dark;  /* 위 다크 값과 동일하게 재정의 */ }
[data-theme="light"] { color-scheme: light; /* 위 라이트 값과 동일하게 재정의 */ }
```

> 카테고리 색상(`--cat-color`)은 모드와 무관하게 동일하게 쓰되, 다크 모드에서 명암비가 부족하면 텍스트 위에 직접 올리지 않고 색 띠/테두리로만 사용한다.

---

## 3. 허브 페이지 레이아웃 (`src/index.html`)

허브는 53개 실험을 8개 카테고리로 묶어 탐색·필터링하는 진입점이다. 구조는 위에서 아래로 **헤더 → 필터 바 → 카테고리 섹션(카드 그리드)** 순서다.

### 3.1 전체 와이어프레임

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  🔬 Git Science Park            [🌙 다크모드 토글]     │    │
│  │  과학사 인터랙티브 실험실                              │    │
│  │  [ 53 실험 ] [ 8 카테고리 ] [ 준비중 ]                 │  ← 통계 배지
│  └──────────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────────┤
│  FILTER BAR (sticky)                                           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ [🔍 실험·과학자 검색...........................]        │    │
│  │ 카테고리: (전체)(🏛️고대)(🔭과학혁명)(⚗️18세기)...      │  ← 칩 토글
│  │ 난이도:   (전체)(⭐)(⭐⭐)(⭐⭐⭐)(⭐⭐⭐⭐)(⭐⭐⭐⭐⭐)│    │
│  └──────────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────────┤
│  🏛️ 고대 (Ancient) — 측정과 기하학의 탄생         [4]  ▌#8B4513│  ← 섹션 헤더 + 색 띠
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ CARD   │ │ CARD   │ │ CARD   │ │ CARD   │                  │  ← 카드 그리드
│  └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                │
│  🔭 과학혁명 (Scientific Revolution) ...          [7]  ▌#2E4A62│
│  ┌────────┐ ┌────────┐ ┌────────┐ ...                         │
│  └────────┘ └────────┘ └────────┘                             │
│  ... (카테고리 03~08 동일 패턴) ...                            │
├──────────────────────────────────────────────────────────────┤
│  FOOTER  · GitHub · 라이선스 · 53개 실험 / Zero Dependencies   │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 헤더 (Header)
- 좌측: 사이트 로고/타이틀 + 부제(과학사 인터랙티브 실험실).
- 우측: 라이트/다크 모드 토글 버튼.
- 통계 배지: 총 실험 수(53), 카테고리 수(8), 진행 상태 요약. 현재 모든 실험은 `planned`이므로 "준비중"으로 표기한다.

### 3.3 필터 바 (Filter Bar)
- 스크롤 시 상단에 고정(`position: sticky; top: 0`)하여 탐색 중 항상 접근 가능.
- **검색 입력**: 제목·영문명·과학자 이름을 대상으로 실시간 필터링(클라이언트 측, `experiments.json` 기반).
- **카테고리 칩**: 8개 카테고리 + "전체". 선택 시 해당 섹션만 노출.
- **난이도 칩**: 1~5(⭐~⭐⭐⭐⭐⭐) + "전체".
- 필터는 AND 결합(검색어 ∧ 카테고리 ∧ 난이도). 결과 0건이면 빈 상태 메시지를 표시한다.

### 3.4 카테고리 섹션 + 카드 그리드
- 각 섹션은 카테고리 색 띠(좌측 또는 상단 4px 라인)와 아이콘·이름·영문명·설명·실험 개수 헤더를 갖는다.
- 카드는 CSS Grid로 반응형 배치(아래 §6 참조).
- 섹션 순서는 `01-ancient` → `08-modern` 고정. 카테고리별 카드 수: 고대 4, 과학혁명 7, 18세기 5, 19세기 7, 원자의 시대 9, 양자역학 7, 상대성·우주론 7, 현대 물리학 7 (합계 53).

---

## 4. 실험 카드 (Experiment Card)

허브에서 각 실험을 대표하는 카드. 링크 경로는 `./experiments/{category}/{slug}.html` 형식이다.

### 4.1 구성요소

```
┌────────────────────────────────┐
│▌ #8B4513  ← 카테고리 색 띠       │   ▌ = data-category 색상
│  [준비중]            ⭐⭐⭐      │   ← 상태 배지(좌상) / 난이도(우상)
│                                │
│  에라토스테네스의 지구 둘레 측정 │   ← 제목 (--fs-md)
│  Eratosthenes' Measurement     │   ← 영문명 (--fs-sm, muted)
│  기원전 240년 · 에라토스테네스   │   ← 연도 · 과학자 (--fs-sm)
│                                │
│  그림자 길이만으로 지구의 크기를 │   ← 한 줄 설명 (--fs-sm)
│  계산한 최초의 측정 실험.        │
└────────────────────────────────┘
```

| 요소 | 데이터 출처 | 스타일 |
|---|---|---|
| 카테고리 색 띠 | `category` → `--cat-color` | 상단/좌측 4px accent strip |
| 상태 배지 | `status` | pill 배지. `planned` → "준비중" |
| 난이도 | `difficulty` (1~5) | ⭐ 개수, `aria-label="난이도 N/5"` |
| 제목 | `title` | `--fs-md`, `--fw-bold` |
| 영문명 | `titleEn` | `--fs-sm`, `--color-text-muted` |
| 연도 · 과학자 | `year` · `scientist` | `--fs-sm` |
| 한 줄 설명 | `summary` | `--fs-sm`, 최대 2줄 말줄임 |

### 4.2 "준비중"(planned) 비활성 카드 처리

현재 53개 실험은 모두 `status=planned`이므로 카드는 **비활성(클릭 불가)** 상태로 렌더링한다.

- 카드 위에 반투명 오버레이(`--color-overlay`)를 깔고, 중앙에 "🚧 준비중" 라벨을 표시한다.
- `pointer-events: none`로 링크를 비활성화하고, 카드 컨테이너에 `aria-disabled="true"`를 부여한다.
- 본문은 약간 채도를 낮춰(`filter: grayscale(0.25); opacity: 0.85`) 가용 카드와 시각적으로 구분한다.
- 호버 시 카드가 떠오르는 효과(`--shadow-lg`)는 적용하지 않는다(상호작용 불가 신호).
- `status`가 향후 `ready`로 바뀌면 오버레이 제거, 링크 활성화, 호버 효과 복원.

```css
.card[data-status="planned"] {
  position: relative;
  filter: grayscale(0.25);
  opacity: 0.85;
  cursor: default;
}
.card[data-status="planned"] .card-link { pointer-events: none; }
.card[data-status="planned"]::after {
  content: "🚧 준비중";
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: var(--color-overlay);
  color: var(--color-text); font-weight: var(--fw-bold);
  border-radius: var(--radius-lg);
}
.card[data-status="ready"]:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
```

상태 배지 색상:

| status | 라벨 | 색상 |
|---|---|---|
| `ready` | 학습 가능 | `--color-accent` (또는 녹색 계열) |
| `in-progress` | 제작 중 | 주황 계열 |
| `planned` | 준비중 | `--color-disabled` |

---

## 5. 실험 페이지 3탭 UI 패턴

각 실험 페이지(`src/experiments/{category}/{slug}.html`)는 독립 실행 가능한 단일 HTML 파일이며, 3개의 탭으로 구성된다.

### 5.1 페이지 골격

```
┌──────────────────────────────────────────────────────┐
│ ← 허브로  |  ▌카테고리색  에라토스테네스의 지구 둘레 측정 │  헤더
│            기원전 240년 · 에라토스테네스 · ⭐⭐⭐        │
├──────────────────────────────────────────────────────┤
│ TAB BAR:  [ 🎮 인터랙티브 ] [ 📚 원리 학습 ] [ 📜 역사적 맥락 ]│
├──────────────────────────────────────────────────────┤
│ ┌── 탭 패널 (활성 탭만 표시) ────────────────────────┐  │
│ │                                                  │  │
│ │   (탭별 내용 — 아래 5.2 / 5.3 / 5.4 참조)         │  │
│ │                                                  │  │
│ └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- **탭 바**: `role="tablist"`, 각 탭 `role="tab"`, 패널 `role="tabpanel"`. 활성 탭은 카테고리 색 밑줄로 표시.
- 키보드: `←`/`→`로 탭 이동, `Home`/`End`로 처음/끝 이동, `Enter`/`Space`로 활성화.
- 탭 전환은 페이지 리로드 없이 패널 표시/숨김으로 처리(Vanilla JS).

### 5.2 탭 1 — 🎮 인터랙티브

직접 조작 학습 루프의 중심. 캔버스(시뮬레이션) + 컨트롤 + 결과 + 힌트로 구성.

```
┌──────────────────────────────────────────────┐
│  [ Canvas / SVG 시뮬레이션 영역 ]              │  .sim-stage (2D Canvas)
│                                                │
├──────────────────────────────────────────────┤
│  .controls                                     │
│   태양 각도   [────●────────]  7.2°            │  슬라이더 + 라이브 값
│   도시 거리   [──────●──────]  800 km          │
│   [ ▶ 측정 ]  [ ↺ 리셋 ]                       │  버튼
├──────────────────────────────────────────────┤
│  .result-box   추정 둘레: 40,000 km            │  강조 결과 (mono)
│                오차: 1.6%                       │
├──────────────────────────────────────────────┤
│  .hint-box  💡 두 도시의 그림자 각도 차이가...  │  보조 힌트
└──────────────────────────────────────────────┘
```

- **`.controls`**: 슬라이더·버튼 등 조작 요소. 모든 입력에는 `<label>`과 라이브 값 표시(`aria-live` 갱신).
- **`.result-box`**: 계산 결과를 모노스페이스로 강조. 배경은 `--color-surface-alt`.
- **`.hint-box`**: 관찰·해석을 돕는 힌트. 좌측 색 띠 + 💡 아이콘. 값 변화 시 `aria-live="polite"`로 보조 안내.

### 5.3 탭 2 — 📚 원리 학습

실험에 담긴 과학 원리를 개념 → 수식 → 퀴즈 순으로 설명.

- **`.concept`**: 핵심 개념 설명. 소제목·문단·다이어그램(SVG).
- **`.formula`**: 관련 수식. 모노스페이스 코드블록 또는 정렬된 수식 표기. 각 변수의 의미를 표로 부연.
- **`.quiz`**: 이해 확인용 객관식/단답 퀴즈. 정답 선택 시 즉시 피드백(정답/오답 + 해설). 키보드로 선택 가능, 결과는 `aria-live`로 안내.

### 5.4 탭 3 — 📜 역사적 맥락

실험이 등장한 시대 배경과 과학사적 의의를 다룬다.

- **`.timeline`**: 연표. 세로형 타임라인 항목(연도 · 사건 · 설명). 카테고리 색 점/선으로 연결.
- **`.key-point`**: 핵심 포인트 카드. 이 실험이 과학사에 남긴 의의, 후대에 미친 영향 등을 강조 박스로 정리.

---

## 6. 반응형 브레이크포인트

모바일 우선(Mobile First)으로 설계하고 너비가 커질수록 열 수를 늘린다.

| 구간 | 너비 | 카드 그리드 | 컨트롤/패널 |
|---|---|---|---|
| 모바일 (Mobile) | < 640px | 1열 | 컨트롤·캔버스 세로 스택, 필터 바 칩 가로 스크롤 |
| 태블릿 (Tablet) | 640px ~ 1023px | 2열 | 캔버스 위 / 컨트롤 아래, 탭 바 전체 폭 |
| 데스크톱 (Desktop) | ≥ 1024px | 3열 이상 (auto-fill) | 캔버스 좌 / 컨트롤 우 2단 배치 가능 |

```css
.card-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;                 /* 모바일: 1열 */
}
@media (min-width: 640px) {                    /* 태블릿: 2열 */
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {                   /* 데스크톱: 자동 채움 */
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
```

- 콘텐츠 최대 폭은 약 1200px 컨테이너로 제한하고 좌우 중앙 정렬한다.
- 캔버스 시뮬레이션은 컨테이너 폭에 맞춰 리사이즈하되, `devicePixelRatio`를 반영해 선명도를 유지한다.
- 터치 환경에서는 슬라이더 손잡이와 버튼을 ≥ 44×44px로 키운다.

---

## 7. 접근성 가이드 (Accessibility)

### 7.1 색 대비
- 본문 텍스트 대 배경 명암비 **≥ 4.5:1**(WCAG AA), 큰 텍스트(≥ 24px 또는 굵은 19px)는 **≥ 3:1**.
- UI 컴포넌트·그래픽 경계는 **≥ 3:1**.
- 카테고리 색을 텍스트 배경으로 쓸 때 대비가 부족하면 흰/검정 글자 중 명암비를 만족하는 쪽을 자동 선택하거나, 색을 띠/테두리로만 제한한다.
- 색만으로 정보를 전달하지 않는다(상태는 배지 텍스트 "준비중", 난이도는 ⭐ 개수 + `aria-label` 병행).

### 7.2 키보드 내비게이션
- 모든 상호작용 요소는 `Tab` 순서에 포함되고, 가시적 포커스 링(`--color-focus-ring`, 2px outline + offset)을 갖는다.
- 탭 바는 화살표 키 패턴(WAI-ARIA Tabs), 슬라이더는 화살표/`Home`/`End`로 값 조정.
- 카드 링크는 `Enter`로 진입. `planned` 카드는 포커스 가능하되 활성화 시 "준비중" 안내.
- 포커스 트랩을 만들지 않고, 모달이 없으므로 페이지 내 흐름을 그대로 유지한다.

### 7.3 ARIA
- 탭: `role="tablist" / "tab" / "tabpanel"`, `aria-selected`, `aria-controls`, `tabindex` 관리.
- 라이브 결과: `.result-box`와 힌트는 `aria-live="polite"`로 값 변화 안내.
- 슬라이더(커스텀일 경우): `role="slider"`, `aria-valuemin/max/now`, `aria-label`.
- 카드: 접근 가능한 이름은 제목 + 카테고리 + 상태로 구성. `aria-disabled`로 비활성 상태 전달.
- 아이콘 이모지는 의미를 가질 때 `aria-label` 또는 인접 텍스트로 설명, 장식이면 `aria-hidden="true"`.

### 7.4 모션 최소화
- `prefers-reduced-motion: reduce`를 존중해 전환·시뮬레이션 애니메이션을 즉시 표시/정지로 대체한다.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- 자동 재생되는 시뮬레이션은 재생/정지 토글을 제공하고, 감속 옵션이 켜지면 기본 정지 상태로 시작한다.

### 7.5 기타
- 이미지/다이어그램(SVG)에는 대체 텍스트 또는 `<title>`/`<desc>`를 제공한다.
- 브라우저 확대 200%에서 레이아웃이 깨지지 않도록 상대 단위(`rem`, `%`, `fr`)를 사용한다.
- 지원 브라우저는 Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (IE 미지원)를 기준으로 검증한다.
