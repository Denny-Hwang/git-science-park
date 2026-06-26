# 기여 가이드 (Contributing)

**Git Science Park**(과학사 인터랙티브 실험실)에 관심을 가져 주셔서 감사합니다! 🔬

이 프로젝트는 과학사의 핵심 실험 **53개**를 "조작 → 관찰 → 해석"의 흐름으로 직접 다루며 배우는 인터랙티브 학습 플랫폼입니다. 누구나 새 실험을 추가하거나 기존 실험을 개선할 수 있도록 열려 있습니다. 물리학 지식, 프런트엔드 기술, 글쓰기, 디자인 감각 — 어떤 형태의 기여든 환영합니다.

- 저장소: <https://github.com/Denny-Hwang/git-science-park>
- 배포 사이트: <https://denny-hwang.github.io/git-science-park/>

> 처음 기여하시나요? 부담 갖지 마세요. 작은 오타 수정도 훌륭한 첫 PR입니다. 막히는 부분이 있으면 언제든 이슈로 질문해 주세요.

---

## 목차

1. [기여 유형](#1-기여-유형)
2. [행동 강령](#2-행동-강령)
3. [이슈 등록 방법](#3-이슈-등록-방법)
4. [개발 환경 준비](#4-개발-환경-준비)
5. [Pull Request 프로세스](#5-pull-request-프로세스)
6. [커밋 컨벤션](#6-커밋-컨벤션)
7. [코딩 컨벤션](#7-코딩-컨벤션)
8. [새 실험 추가 방법](#8-새-실험-추가-방법)
9. [라이선스 동의](#9-라이선스-동의)

---

## 1. 기여 유형

| 유형 | 설명 | 예시 |
| --- | --- | --- |
| 🧪 **새 실험** | 53개 실험 중 아직 `planned` 상태인 항목을 구현 | Eratosthenes의 지구 둘레 측정 페이지 작성 |
| 🐛 **버그 수정** | 시뮬레이션 오작동, 레이아웃 깨짐, 계산 오류 등 수정 | Canvas 애니메이션이 모바일에서 멈추는 문제 해결 |
| 📚 **문서** | 가이드 보강, 오타 수정, 번역, 원리/역사 설명 개선 | "원리 학습" 탭의 수식 설명 보완 |
| 🎨 **디자인 개선** | UI/UX, 접근성, 반응형 레이아웃, 카테고리 테마 개선 | 색약 사용자를 위한 대비 개선 |

어떤 유형이든 **먼저 이슈를 열어** 방향을 맞춘 뒤 작업을 시작하는 것을 권장합니다. 특히 새 실험이나 큰 변경은 중복 작업과 리뷰 마찰을 줄이기 위해 사전 논의가 중요합니다.

---

## 2. 행동 강령 (Code of Conduct)

우리는 모든 참여자가 환영받는다고 느끼는 커뮤니티를 지향합니다. 기여에 참여함으로써 아래에 동의하는 것으로 간주합니다.

- 서로를 **존중**하고, 경험 수준·배경·관점의 차이를 환영합니다.
- 비판은 **코드와 아이디어**를 향하게 하고, 사람을 향하지 않습니다.
- 차별, 괴롭힘, 모욕적 언행을 용납하지 않습니다.
- 과학적 정확성을 중시하되, 모르는 것을 묻는 일은 부끄러운 것이 아닙니다.

부적절한 행동을 목격했다면 저장소 메인테이너에게 이슈 또는 비공개 연락으로 알려 주세요.

---

## 3. 이슈 등록 방법

이슈는 [GitHub Issues](https://github.com/Denny-Hwang/git-science-park/issues)에서 등록합니다. 목적에 맞는 아래 템플릿 항목을 모두 채워 주세요.

### 🐛 버그 리포트

| 항목 | 내용 |
| --- | --- |
| **요약** | 한 문장으로 문제 설명 |
| **재현 절차** | 1. … 2. … 3. … (단계별로) |
| **기대 동작** | 원래 어떻게 동작해야 하는가 |
| **실제 동작** | 실제로 무엇이 일어났는가 (에러 메시지 포함) |
| **환경** | OS / 브라우저 + 버전 / 화면 크기(데스크톱·태블릿·모바일) |
| **스크린샷·녹화** | 가능하면 캡처 또는 콘솔 로그 첨부 |
| **관련 실험** | 해당 실험 slug 또는 페이지 경로 |

### ✨ 기능 제안

- **문제 상황**: 어떤 불편이나 한계가 있는가
- **제안 내용**: 무엇을 어떻게 바꾸고 싶은가
- **대안**: 고려한 다른 방법이 있다면
- **추가 컨텍스트**: 참고 자료, 모킹, 스크린샷

### 🧪 실험 제안

새로운 과학사 실험을 추천할 때:

- **실험명 / 인물·연도**
- **카테고리**: 아래 8개 중 하나 (`01-ancient` ~ `08-modern`)
- **핵심 아이디어**: 무엇을 "조작 → 관찰 → 해석"으로 보여줄 것인가
- **난이도(difficulty) 제안**: 1~5
- **참고 자료**: 신뢰할 수 있는 출처

#### 카테고리 참고

| ID | 카테고리 | 시대/주제 |
| --- | --- | --- |
| `01-ancient` | 🏛️ 고대 (Ancient) | 측정과 기하학의 탄생 |
| `02-scientific-revolution` | 🔭 과학혁명 (Scientific Revolution) | 실험과 수학의 결합 |
| `03-precision-era` | ⚗️ 18세기 (Precision Era) | 정밀 측정의 시대 |
| `04-energy-field` | 🔥 19세기 (Energy & Field) | 에너지와 장의 시대 |
| `05-atomic` | ⚛️ 원자의 시대 (Atomic Age) | 물질의 궁극 구조 |
| `06-quantum` | 🌊 양자역학 (Quantum Mechanics) | 양자역학의 형성 |
| `07-relativity` | 🌌 상대성·우주론 (Relativity & Cosmology) | 상대성이론과 우주론 |
| `08-modern` | 🔬 현대 물리학 (Modern Physics) | 극한의 탐험 |

### 라벨 가이드

메인테이너가 분류를 돕기 위해 라벨을 부여합니다. 이슈 등록 시 적절한 라벨을 제안해도 좋습니다.

| 라벨 | 의미 |
| --- | --- |
| `bug` | 동작 오류 |
| `enhancement` | 기능 개선·제안 |
| `experiment` | 새 실험 추가·관련 작업 |
| `documentation` | 문서 관련 |
| `design` | UI/UX·접근성·디자인 |
| `good first issue` | 입문자에게 적합한 작은 작업 |
| `help wanted` | 도움이 필요한 작업 |
| `question` | 질문·논의 |
| `duplicate` / `wontfix` / `invalid` | 중복·보류·무효 처리 |

---

## 4. 개발 환경 준비

이 프로젝트는 **Zero Dependencies** 정적 웹사이트입니다. HTML5 + CSS3 + Vanilla JavaScript(ES6+)만 사용하며 빌드 도구·프레임워크·패키지 매니저가 필요 없습니다. 클론만 하면 바로 시작할 수 있습니다.

자세한 설정은 **[docs/03-development/SETUP.md](docs/03-development/SETUP.md)**를 참고하세요. 요약은 다음과 같습니다.

```bash
# 1) 저장소 포크 후 클론
git clone https://github.com/<your-username>/git-science-park.git
cd git-science-park

# 2) 정적 서버 실행 (아무거나 하나 선택)
# Python 3
python3 -m http.server 8000 --directory src

# Node (npx, 설치 없이)
npx serve src

# VS Code Live Server 확장도 사용 가능
```

브라우저에서 <http://localhost:8000/> 에 접속하면 허브(`src/index.html`)가 열립니다.

> 단순히 `file://`로 HTML을 직접 열어도 각 실험 페이지는 독립 실행되지만, 허브의 데이터 로딩(`src/data/experiments.json`)은 `fetch`를 사용하므로 **정적 서버로 실행**하는 것을 권장합니다.

### 지원 브라우저

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (Internet Explorer 미지원). 데스크톱·태블릿·모바일 반응형을 모두 지원해야 합니다.

---

## 5. Pull Request 프로세스

```
포크 → 브랜치 생성 → 작업 → 셀프 체크리스트 → PR 생성 → 리뷰 → Squash Merge
```

1. **포크 & 브랜치**: 저장소를 포크하고, `main`에서 새 브랜치를 만듭니다. 브랜치 네이밍은 **[docs/03-development/GIT-WORKFLOW.md](docs/03-development/GIT-WORKFLOW.md)**의 규칙을 따릅니다. 일반적인 형태:
   - `feat/<category>-<slug>` — 새 실험/기능 (예: `feat/01-ancient-eratosthenes`)
   - `fix/<설명>` — 버그 수정
   - `docs/<설명>` — 문서
   - `design/<설명>` — 디자인/UI
2. **작업**: 한 PR은 **하나의 목적**에 집중합니다. 관련 없는 변경은 분리하세요.
3. **셀프 체크리스트** (PR 올리기 전 직접 확인):
   - [ ] 정적 서버에서 실제로 동작을 확인했다.
   - [ ] 콘솔에 에러·경고가 없다.
   - [ ] Zero Dependencies 원칙을 지켰다 (외부 라이브러리/CDN/빌드 도구 미추가).
   - [ ] 반응형(모바일/태블릿/데스크톱)에서 레이아웃이 깨지지 않는다.
   - [ ] 지원 브라우저 중 최소 2종에서 테스트했다.
   - [ ] (새 실험 시) 3개 탭이 모두 채워졌고 `experiments.json`에 항목을 추가했다.
   - [ ] 커밋 메시지가 Conventional Commits 규칙을 따른다.
4. **PR 생성**: 제목은 커밋 컨벤션과 동일한 형식을 권장합니다. 본문에 **무엇을·왜** 바꿨는지, 관련 이슈 번호(`Closes #123`), 스크린샷/GIF(시각 변경 시)를 포함하세요.
5. **리뷰**: 메인테이너가 리뷰합니다. 피드백에는 추가 커밋으로 대응하면 됩니다(강제 푸시 불필요).
6. **Squash Merge**: 승인되면 **Squash Merge**로 병합합니다. 여러 커밋이 하나의 깔끔한 커밋으로 합쳐지므로, 작업 중 커밋을 잘게 나누어도 괜찮습니다.

---

## 6. 커밋 컨벤션

커밋 메시지는 **[Conventional Commits](https://www.conventionalcommits.org/)**를 따릅니다.

```
<type>(<scope>): <subject>
```

| type | 용도 |
| --- | --- |
| `feat` | 새 기능·새 실험 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 포맷팅·세미콜론 등 동작에 영향 없는 변경 |
| `refactor` | 동작 변화 없는 코드 구조 개선 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드/설정/기타 잡무 |

- `scope`는 카테고리나 영역을 권장합니다 (예: `01-ancient`, `hub`, `data`).
- `subject`는 명령형 현재시제로 간결하게 작성합니다 (예: "add", "fix", "한국어 가능").

예시:

```
feat(01-ancient): add Eratosthenes earth circumference experiment
fix(hub): 준비중 카드가 클릭되던 문제 수정
docs(contributing): 새 실험 추가 절차 보강
```

---

## 7. 코딩 컨벤션

전체 규칙은 **[docs/03-development/CODING-STANDARDS.md](docs/03-development/CODING-STANDARDS.md)**에 있습니다. 핵심만 요약하면:

- **Zero Dependencies**: 외부 라이브러리·프레임워크·빌드 도구·CDN을 추가하지 않습니다. HTML5 / CSS3 / Vanilla JS(ES6+), 2D 시뮬레이션은 Canvas API, 다이어그램은 SVG를 사용합니다.
- **단일 HTML 파일**: 각 실험은 `src/experiments/{category}/{slug}.html` 하나로 **독립 실행** 가능해야 합니다. CSS·JS는 해당 파일 안에 인라인으로 포함합니다.
- **오프라인 실행**: 네트워크 없이도 실험 페이지가 동작해야 합니다.
- **접근성(a11y)**: 의미론적 HTML, 충분한 색 대비, 키보드 조작 가능, `alt`/`aria-*` 속성 제공, 폰트 크기 가독성을 고려합니다.
- **반응형**: 모바일·태블릿·데스크톱 모두에서 깨지지 않게 작성합니다.
- **모던 JS**: `const`/`let`, 화살표 함수, 모듈식 함수 구성. 전역 오염을 피합니다.
- **카테고리 테마**: 각 카테고리의 대표 색상을 일관되게 사용합니다.

---

## 8. 새 실험 추가 방법

가장 환영하는 기여입니다. 현재 모든 실험은 `status=planned`(허브에서 "준비중" 비활성 표시) 상태이므로, 빈 실험을 구현하면 곧바로 사이트에 반영됩니다. 아래 단계를 따르세요.

### 1단계 — 실험 페이지 파일 생성

`src/experiments/{category}/` 폴더에 `{slug}.html`을 만듭니다. 템플릿 **[docs/02-design/EXPERIMENT-TEMPLATE.md](docs/02-design/EXPERIMENT-TEMPLATE.md)**의 구조를 복사해 시작하세요.

- `category`는 8개 중 하나입니다 (`01-ancient` … `08-modern`).
- `slug`는 **카테고리별 01부터 시작하는 2자리 일련번호 + 영문 슬러그** 형태입니다.

```text
src/experiments/01-ancient/01-eratosthenes.html
src/experiments/06-quantum/03-double-slit.html
```

### 2단계 — 3개 탭 모두 채우기

모든 실험 페이지는 다음 **3개 탭**을 갖습니다. 어느 하나도 비워 두지 않습니다.

| 탭 | 내용 |
| --- | --- |
| 🎮 **인터랙티브** | 사용자가 변수를 조작하고(슬라이더·버튼 등) 결과를 관찰하는 Canvas/SVG 시뮬레이션 |
| 📚 **원리 학습** | 실험의 과학 원리, 수식, 핵심 개념 설명 |
| 📜 **역사적 맥락** | 인물, 시대 배경, 실험이 과학사에 미친 영향 |

### 3단계 — 메타데이터 등록

`src/data/experiments.json`에 새 항목을 추가합니다. 스키마(자세한 내용은 **[docs/02-design/DATA-MODEL.md](docs/02-design/DATA-MODEL.md)** 참고)를 지켜 주세요.

- `id`는 저장소 전체에서 **유일**해야 합니다.
- `category`, `slug`, 링크 경로가 실제 파일 위치(`./experiments/{category}/{slug}.html`)와 일치해야 합니다.
- `difficulty`는 1~5.
- `status`는 구현이 완료되어 노출할 준비가 되면 `ready`로, 작업 중이면 `in-progress`로, 아직 미착수면 `planned`로 설정합니다.

```jsonc
{
  "id": "eratosthenes",
  "category": "01-ancient",
  "slug": "01-eratosthenes",
  "title": "에라토스테네스의 지구 둘레 측정",
  "difficulty": 2,
  "status": "ready"
}
```

> `status` 값은 `ready` | `planned` | `in-progress` 중 하나입니다. 허브는 `ready`가 아닌 실험을 "준비중"으로 비활성 표시합니다.

### 4단계 — 허브에서 카드 확인

`src/index.html`(허브)을 정적 서버로 열어, 새 실험 카드가 해당 카테고리 아래에 노출되고 링크(`./experiments/{category}/{slug}.html`)가 올바른 페이지로 연결되는지 확인합니다.

### 5단계 — 점검 후 PR

반응형(모바일/태블릿/데스크톱)과 크로스 브라우저(최소 2종)에서 동작을 확인한 뒤, [PR 프로세스](#5-pull-request-프로세스)에 따라 PR을 생성합니다.

> 병합되어 `main`에 push되면 GitHub Actions(`.github/workflows/deploy.yml`)가 `src/` 폴더를 GitHub Pages로 자동 배포합니다.

---

## 9. 라이선스 동의

이 프로젝트는 **MIT License**로 배포됩니다([LICENSE](LICENSE) 참고). 기여를 제출(PR)함으로써, 귀하의 기여가 **MIT License 하에 배포되는 것에 동의**하는 것으로 간주합니다. 본인이 작성했거나 호환되는 라이선스로 사용 권한이 있는 콘텐츠만 제출해 주세요.

---

함께 과학사를 손끝으로 탐험하는 멋진 학습 공간을 만들어 갑시다. 기여해 주셔서 감사합니다! 🙌
