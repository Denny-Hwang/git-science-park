# 개발 환경 설정 (Setup)

이 문서는 **Git Science Park**(과학사 인터랙티브 실험실)를 로컬에서 실행하고 개발하기 위한 환경 설정 방법을 안내한다. 본 프로젝트는 **빌드 도구가 전혀 필요 없는 순수 정적 웹사이트**(HTML5 + CSS3 + Vanilla JavaScript)이므로, 설정은 매우 단순하다.

---

## 1. 사전 요구사항 (Prerequisites)

| 도구 | 필수 여부 | 설명 |
| --- | --- | --- |
| **최신 브라우저** | 필수 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ 중 하나. (IE는 지원하지 않음) |
| **코드 에디터** | 권장 | [VS Code](https://code.visualstudio.com/) 권장. 어떤 텍스트 에디터든 사용 가능. |
| **git** | 필수 | 저장소 클론 및 기여를 위해 필요. |
| **정적 서버** | 권장 | Python 3 또는 Node.js. (아래 [3. 로컬 실행](#3-로컬-실행-local-development) 참고) |

### 빌드 도구는 필요 없습니다 (Zero Dependencies)

이 프로젝트는 **외부 라이브러리·프레임워크·번들러·트랜스파일러를 사용하지 않는다.**

- `npm install` 같은 의존성 설치 단계가 **없다.**
- `package.json`, `node_modules`, webpack/vite 같은 빌드 산출물이 **없다.**
- 모든 시뮬레이션은 브라우저 내장 기능인 **Canvas API(2D)** 와 **SVG** 로 직접 구현한다.
- 각 실험은 **독립 실행 가능한 단일 HTML 파일**이므로, 이론적으로는 더블클릭만으로도 열린다.

### 그런데 왜 "정적 서버"가 필요한가?

허브(`src/index.html`)는 실험 목록 메타데이터를 `fetch()` 로 `src/data/experiments.json` 에서 읽어온다.

브라우저는 보안 정책상 `file://` 프로토콜에서의 `fetch()`/XHR 요청을 **CORS(교차 출처) 제한**으로 차단한다. 따라서 `index.html` 을 파일 탐색기에서 더블클릭해 `file://` 로 열면 **실험 목록이 비어 보이거나 로딩 오류**가 발생한다.

이 문제를 피하려면 아주 가벼운 **로컬 정적 서버**를 띄워 `http://localhost` 로 접속하면 된다. 별도 설치가 부담된다면 Python 또는 Node 중 이미 있는 것을 쓰면 된다.

> 참고: 개별 실험 페이지(`src/experiments/.../*.html`)는 자체적으로 외부 JSON을 불러오지 않는 단일 파일 구조이므로 `file://` 로도 대부분 동작하지만, **개발 시에는 항상 정적 서버를 통해 접속하는 것을 표준으로 한다.**

---

## 2. 저장소 클론 (Clone)

```bash
git clone https://github.com/Denny-Hwang/git-science-park.git
cd git-science-park
```

SSH를 선호한다면:

```bash
git clone git@github.com:Denny-Hwang/git-science-park.git
cd git-science-park
```

---

## 3. 로컬 실행 (Local Development)

**핵심 규칙:** 서버의 루트는 항상 `src/` 폴더이며, 브라우저로 **`http://localhost:8000`** 에 접속한다.

### 방법 A — Python (별도 설치 없이 가장 흔함)

대부분의 macOS/Linux와 Python이 설치된 Windows에서 바로 쓸 수 있다.

```bash
cd src
python3 -m http.server 8000
```

이제 브라우저에서 다음 주소를 연다:

```
http://localhost:8000
```

> Windows에서 `python3` 가 없다면 `python -m http.server 8000` 을 사용한다.

### 방법 B — Node.js (`npx serve`)

Node.js가 설치되어 있다면 별도 설치 없이 `npx` 로 즉시 실행할 수 있다. (루트에서 실행하며 `src` 를 인자로 지정)

```bash
npx serve src
```

`serve` 가 안내하는 주소(보통 `http://localhost:3000`)로 접속한다. 포트를 고정하고 싶다면:

```bash
npx serve src -l 8000
```

### 방법 C — VS Code Live Server 확장

VS Code 사용자에게 가장 편리한 방법이다.

1. VS Code 확장 마켓플레이스에서 **Live Server**(ritwickdey.LiveServer)를 설치한다.
2. 탐색기에서 **`src/index.html`** 을 연다.
3. 우클릭 → **"Open with Live Server"** 또는 우측 하단 상태바의 **"Go Live"** 버튼을 누른다.
4. 브라우저가 자동으로 열리며 라이브 리로드(파일 저장 시 자동 새로고침)가 동작한다.

> Live Server는 워크스페이스 루트를 기준으로 서비스한다. `src/index.html` 을 직접 "Go Live" 로 열면 해당 경로가 진입점이 되어 `experiments.json` 도 정상적으로 로드된다.

### 동작 확인

접속 후 허브 페이지에 8개 카테고리와 실험 카드가 보이면 정상이다. 현재 모든 실험의 `status` 는 `planned` 이므로 카드들은 **"준비중"** 으로 비활성 표시된다.

---

## 4. 프로젝트 구조 (Project Structure)

```
git-science-park/
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions: main push 시 src/ 자동 배포
├── docs/                         # 프로젝트 문서
│   ├── 01-planning/              # PRD, ROADMAP, USER-STORIES
│   ├── 02-design/                # ARCHITECTURE, DATA-MODEL, EXPERIMENT-TEMPLATE, UI-DESIGN
│   ├── 03-development/           # SETUP(현재 문서), CODING-STANDARDS, GIT-WORKFLOW
│   └── 04-experiments/           # 실험별 기획/노트
├── src/                          # ★ 배포 루트 (정적 서버의 루트)
│   ├── index.html                # 허브: 카테고리·실험 목록
│   ├── data/
│   │   └── experiments.json      # 전체 실험 메타데이터 (53개)
│   ├── assets/
│   │   ├── css/                  # 공통 스타일
│   │   └── js/                   # 공통 스크립트
│   └── experiments/              # 카테고리별 실험 페이지
│       ├── 01-ancient/           # 🏛️ 고대 (4개)
│       ├── 02-scientific-revolution/  # 🔭 과학혁명 (7개)
│       ├── 03-precision-era/     # ⚗️ 18세기 (5개)
│       ├── 04-energy-field/      # 🔥 19세기 (7개)
│       ├── 05-atomic/            # ⚛️ 원자의 시대 (9개)
│       ├── 06-quantum/           # 🌊 양자역학 (7개)
│       ├── 07-relativity/        # 🌌 상대성·우주론 (7개)
│       └── 08-modern/            # 🔬 현대 물리학 (7개)
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

- 실험 페이지 파일 규칙: `src/experiments/{category}/{slug}.html`
  - `slug` 예: `01-eratosthenes` (카테고리별로 `01` 부터 시작하는 2자리 일련번호 + 영문 슬러그)
  - 예: `src/experiments/01-ancient/01-eratosthenes.html`
- 허브에서의 링크 경로: `./experiments/{category}/{slug}.html`
- 각 실험 페이지는 **3개 탭**으로 구성된다: 🎮 인터랙티브 / 📚 원리 학습 / 📜 역사적 맥락

> 총 **53개** 실험을 **8개 카테고리**로 분류한다. (고대 4, 과학혁명 7, 18세기 5, 19세기 7, 원자의 시대 9, 양자역학 7, 상대성·우주론 7, 현대 물리학 7)

---

## 5. 새 실험 추가 절차 (개요)

새 실험을 추가하는 흐름은 다음과 같다. 각 단계의 상세 규칙은 참조 문서를 따른다.

1. **템플릿 복사** — 실험 페이지의 표준 구조(3탭 레이아웃, 메타 영역, Canvas/SVG 컨테이너)는
   [`docs/02-design/EXPERIMENT-TEMPLATE.md`](../02-design/EXPERIMENT-TEMPLATE.md) 를 따른다.
2. **파일 생성** — 경로 규칙에 맞춰 `src/experiments/{category}/{NN}-{slug}.html` 파일을 만든다.
3. **메타데이터 등록** — `src/data/experiments.json` 에 실험 항목을 추가한다.
   필드(`id`, `category`, `slug`, `title`, `difficulty`(1~5), `status`(`ready`/`planned`/`in-progress`) 등)의 정의와 규약은
   [`docs/02-design/DATA-MODEL.md`](../02-design/DATA-MODEL.md) 를 참고한다.
4. **코딩 표준 준수** — 명명/주석/접근성/성능 등은
   [`docs/03-development/CODING-STANDARDS.md`](./CODING-STANDARDS.md) 를 따른다.
5. **브랜치·커밋·PR** — 브랜치 전략, 커밋 메시지, PR 절차는
   [`docs/03-development/GIT-WORKFLOW.md`](./GIT-WORKFLOW.md) 를 따른다.
6. **로컬 확인** — 정적 서버로 허브에서 카드가 보이는지, 실험 페이지의 3개 탭이 모두 동작하는지 확인한다.

> 구현이 완료되면 해당 실험의 `status` 를 `planned` → `ready` 로 변경해야 허브에서 활성화되어 클릭할 수 있다.

---

## 6. 배포 흐름 (Deployment)

배포는 **GitHub Pages + GitHub Actions** 로 자동화되어 있어, 별도의 수동 빌드/업로드가 필요 없다.

```
main 브랜치에 push
        │
        ▼
GitHub Actions (.github/workflows/deploy.yml) 트리거
        │
        ▼
src/ 폴더를 Pages 아티팩트로 업로드 → 배포
        │
        ▼
https://denny-hwang.github.io/git-science-park/ 반영
```

- 트리거: `main` 브랜치 `push` (또는 Actions 탭에서 `workflow_dispatch` 수동 실행).
- 워크플로는 `actions/upload-pages-artifact` 로 **`./src` 경로**를 업로드하고 `actions/deploy-pages` 로 게시한다.
- 즉, **배포 루트는 `src/`** 이며, 로컬 정적 서버의 루트와 동일하다.
- 배포 결과는 보통 1~2분 내에 다음 주소에서 확인할 수 있다:
  **https://denny-hwang.github.io/git-science-park/**

> `main` 에 직접 push하기보다, 기능 브랜치에서 작업 후 PR로 병합하는 것을 권장한다. (자세한 내용은 `GIT-WORKFLOW.md` 참고)

---

## 7. 자주 겪는 문제 (Troubleshooting)

### Q1. 허브를 열었는데 실험 목록이 비어 있거나 로딩이 안 됩니다

**원인:** `index.html` 을 파일 탐색기에서 더블클릭해 `file://` 로 열었을 가능성이 높다. `file://` 에서는 `fetch('data/experiments.json')` 이 CORS 정책으로 차단된다.

**해결:** [3. 로컬 실행](#3-로컬-실행-local-development)의 방법 중 하나로 정적 서버를 띄우고 **`http://localhost:8000`** 으로 접속한다. 브라우저 개발자 도구(F12) → Console 탭에서 CORS 또는 네트워크 오류가 찍혀 있는지 확인하면 원인을 빠르게 진단할 수 있다.

### Q2. 코드를 고쳤는데 브라우저에 반영되지 않습니다 (캐시 문제)

**원인:** 브라우저가 이전 버전의 HTML/CSS/JS/JSON을 캐시하고 있음.

**해결:**
- **강력 새로고침:** Windows/Linux `Ctrl + Shift + R`, macOS `Cmd + Shift + R`.
- 개발자 도구를 연 상태에서 Network 탭의 **"Disable cache"** 옵션을 켠다.
- VS Code **Live Server** 를 쓰면 저장 시 자동 리로드되어 이 문제가 거의 발생하지 않는다.

### Q3. `python3 -m http.server` 또는 `npx serve` 가 동작하지 않습니다

- `python3` 명령이 없으면 `python --version` 으로 버전을 확인하고, Python 3이면 `python -m http.server 8000` 을 사용한다.
- `npx serve` 가 처음 실행될 때 패키지 다운로드 동의를 물으면 수락한다. 네트워크가 없는 환경이면 Python 방식이나 Live Server를 사용한다.

### Q4. "포트가 이미 사용 중"이라고 나옵니다 (`Address already in use`)

`8000` 포트를 다른 프로세스가 점유 중이다. 다른 포트로 실행한다.

```bash
python3 -m http.server 8080   # 그리고 http://localhost:8080 접속
```

### Q5. 실험 카드가 클릭되지 않습니다 ("준비중")

이는 버그가 아니다. 현재 모든 실험의 `status` 가 `planned` 이므로 의도적으로 **비활성("준비중")** 상태로 표시된다. 구현 후 `experiments.json` 에서 해당 실험의 `status` 를 `ready` 로 바꾸면 활성화된다. (5절 참고)

### Q6. 한글이 깨져 보입니다 (mojibake)

소스 파일이 **UTF-8(BOM 없음)** 으로 저장되었는지 확인하고, HTML `<head>` 에 `<meta charset="utf-8">` 가 있는지 확인한다. VS Code 우측 하단 인코딩 표시를 `UTF-8` 로 맞춘다.

---

## 참고 문서

| 문서 | 설명 |
| --- | --- |
| [`docs/02-design/ARCHITECTURE.md`](../02-design/ARCHITECTURE.md) | 전체 아키텍처 개요 |
| [`docs/02-design/DATA-MODEL.md`](../02-design/DATA-MODEL.md) | `experiments.json` 데이터 모델/규약 |
| [`docs/02-design/EXPERIMENT-TEMPLATE.md`](../02-design/EXPERIMENT-TEMPLATE.md) | 실험 페이지 표준 템플릿(3탭) |
| [`docs/03-development/CODING-STANDARDS.md`](./CODING-STANDARDS.md) | 코딩 표준 |
| [`docs/03-development/GIT-WORKFLOW.md`](./GIT-WORKFLOW.md) | 브랜치/커밋/PR 워크플로 |
