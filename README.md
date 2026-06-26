# 🧪 Git Science Park

**과학사의 핵심 실험을 직접 조작하며 배우는 인터랙티브 학습 플랫폼**

[![Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2E4A62)](https://denny-hwang.github.io/git-science-park/)
[![Experiments](https://img.shields.io/badge/Experiments-53-C53030)](https://denny-hwang.github.io/git-science-park/)
[![Categories](https://img.shields.io/badge/Eras-8-6B46C1)](#-8개-시대-카테고리)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero-2B6CB0)](#-기술-스택)
[![License: MIT](https://img.shields.io/badge/License-MIT-234E52)](LICENSE)

> 에라토스테네스의 지구 둘레 측정부터 현대 입자물리 실험까지 — 과학사를 **읽는 것**이 아니라 **다루며** 익히는 53개의 인터랙티브 실험실.

🔗 **데모 바로가기:** <https://denny-hwang.github.io/git-science-park/>

---

## 📖 소개

**Git Science Park**는 과학사의 분기점이 된 핵심 실험 **53개**를 브라우저에서 직접 다루며 학습하는 정적 웹 플랫폼입니다.

### 무엇을

각 실험은 단순한 글과 그림이 아니라, 직접 변수를 바꾸고 결과를 관찰할 수 있는 **인터랙티브 시뮬레이션**으로 구성됩니다. 학습자는 다음 흐름을 능동적으로 경험합니다.

```
조작(Manipulate)  →  관찰(Observe)  →  해석(Interpret)
   변수를 바꾸고        결과를 지켜보며       원리와 의미를
   실험을 설계한다       데이터를 모은다       스스로 이해한다
```

### 왜

과학은 결론을 암기하는 학문이 아니라 **질문하고, 실험하고, 해석하는** 과정입니다. Git Science Park는 위대한 발견의 순간을 학습자가 재현하고 변주해 봄으로써, "왜 그런 결론에 도달했는가"를 체득하도록 돕습니다.

### 핵심 특징

| 특징 | 설명 |
| --- | --- |
| 🧫 **53개 실험** | 측정과 기하학의 탄생부터 현대 물리학의 극한까지 |
| 🕰️ **8개 시대** | 고대 → 과학혁명 → 18세기 → 19세기 → 원자 → 양자 → 상대성 → 현대 |
| 🗂️ **3탭 구조** | 🎮 인터랙티브 · 📚 원리 학습 · 📜 역사적 맥락 |
| 📦 **Zero Dependencies** | 외부 라이브러리·프레임워크·빌드 도구 없음 |
| 🔌 **오프라인 실행** | 파일만 있으면 인터넷 없이도 동작 |
| 📱 **반응형** | 모바일 · 태블릿 · 데스크톱 모두 지원 |

---

## 🏛️ 8개 시대 카테고리

| 아이콘 | 시대 (Category) | 실험 수 | 태그라인 |
| :---: | --- | :---: | --- |
| 🏛️ | 고대 (Ancient) | 4 | 측정과 기하학의 탄생 |
| 🔭 | 과학혁명 (Scientific Revolution) | 7 | 실험과 수학의 결합 |
| ⚗️ | 18세기 (Precision Era) | 5 | 정밀 측정의 시대 |
| 🔥 | 19세기 (Energy & Field) | 7 | 에너지와 장의 시대 |
| ⚛️ | 원자의 시대 (Atomic Age) | 9 | 물질의 궁극 구조 |
| 🌊 | 양자역학 (Quantum Mechanics) | 7 | 양자역학의 형성 |
| 🌌 | 상대성·우주론 (Relativity & Cosmology) | 7 | 상대성이론과 우주론 |
| 🔬 | 현대 물리학 (Modern Physics) | 7 | 극한의 탐험 |
| | **합계** | **53** | |

---

## 🛠️ 기술 스택

순수 **정적 웹사이트**로, 빌드 단계 없이 브라우저에서 곧바로 실행됩니다.

- **HTML5** — 시맨틱 마크업
- **CSS3** — 반응형 레이아웃, 다크/라이트 친화적 디자인
- **Vanilla JavaScript (ES6+)** — 프레임워크 없는 순수 자바스크립트
- **Canvas API** — 2D 물리 시뮬레이션 렌더링
- **SVG** — 정밀 다이어그램

> **Zero Dependencies** — npm 설치, 번들러, 트랜스파일러가 필요 없습니다. 각 실험은 **독립 실행 가능한 단일 HTML 파일**이며, 오프라인에서도 동작합니다.

**브라우저 지원:** Chrome 90+ · Firefox 88+ · Safari 14+ · Edge 90+ (Internet Explorer 미지원)

---

## 🚀 실행 방법

### 1. 데모 사이트에서 바로 보기

설치 없이 즉시 체험하려면 데모 URL을 방문하세요.

👉 <https://denny-hwang.github.io/git-science-park/>

### 2. 로컬에서 실행하기

저장소를 클론한 뒤, `src/` 폴더를 정적 서버로 서빙합니다. (단일 HTML 파일이므로 파일을 직접 열어도 되지만, `fetch` 기반 메타데이터 로딩을 위해 정적 서버 사용을 권장합니다.)

```bash
git clone https://github.com/Denny-Hwang/git-science-park.git
cd git-science-park
```

다음 중 편한 방법 하나를 선택하세요.

```bash
# 방법 A — Python 3 내장 서버
python3 -m http.server 8000 --directory src

# 방법 B — Node.js (serve)
npx serve src

# 방법 C — VS Code Live Server 확장
#   src/index.html 을 열고 "Go Live" 클릭
```

브라우저에서 접속합니다.

```
http://localhost:8000
```

---

## 📂 프로젝트 구조

```
git-science-park/
├── README.md                    # 현재 문서
├── CONTRIBUTING.md              # 기여 가이드
├── CHANGELOG.md                 # 변경 이력
├── LICENSE                      # MIT 라이선스
├── docs/                        # 프로젝트 문서
│   ├── 01-planning/             # 기획: PRD, 로드맵, 유저 스토리
│   ├── 02-design/               # 설계: 아키텍처, 데이터 모델, UI
│   ├── 03-development/          # 개발: 셋업, 코딩 표준, Git 워크플로
│   └── 04-experiments/          # 실험별 상세 문서
├── src/                         # 배포 대상 (정적 웹사이트 루트)
│   ├── index.html               # 허브 페이지
│   ├── data/
│   │   └── experiments.json     # 53개 실험 메타데이터
│   ├── assets/
│   │   ├── css/                 # 공용 스타일
│   │   └── js/                  # 공용 스크립트
│   └── experiments/             # 카테고리별 실험 페이지
│       ├── 01-ancient/
│       ├── 02-scientific-revolution/
│       ├── 03-precision-era/
│       ├── 04-energy-field/
│       ├── 05-atomic/
│       ├── 06-quantum/
│       ├── 07-relativity/
│       └── 08-modern/
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Pages 자동 배포
```

실험 페이지 경로 규칙은 `src/experiments/{category}/{slug}.html` 입니다. (예: `src/experiments/01-ancient/01-eratosthenes.html`, 허브 링크는 `./experiments/01-ancient/01-eratosthenes.html`)

### 문서 바로가기

- **기획** — [PRD](docs/01-planning/PRD.md) · [로드맵](docs/01-planning/ROADMAP.md) · [유저 스토리](docs/01-planning/USER-STORIES.md)
- **설계** — [아키텍처](docs/02-design/ARCHITECTURE.md) · [데이터 모델](docs/02-design/DATA-MODEL.md) · [실험 템플릿](docs/02-design/EXPERIMENT-TEMPLATE.md) · [UI 디자인](docs/02-design/UI-DESIGN.md)
- **개발** — [셋업](docs/03-development/SETUP.md) · [코딩 표준](docs/03-development/CODING-STANDARDS.md) · [Git 워크플로](docs/03-development/GIT-WORKFLOW.md)

---

## 🤝 기여 방법

새로운 실험 추가, 시뮬레이션 개선, 문서 보완, 버그 리포트를 모두 환영합니다. 실험 페이지는 [실험 템플릿](docs/02-design/EXPERIMENT-TEMPLATE.md)을 따르고, 메타데이터는 `src/data/experiments.json`에 등록합니다.

자세한 브랜치 전략·커밋 규칙·PR 절차는 **[CONTRIBUTING.md](CONTRIBUTING.md)** 를 참고하세요.

---

## 🗺️ 로드맵

| 버전 | 목표 |
| :---: | --- |
| **v0.1** | 허브 페이지 · 데이터 모델 · 대표 실험 1개로 구조 검증 |
| **v0.5** | 8개 시대 전반에 걸친 핵심 실험 다수 구현 · 공통 컴포넌트 안정화 |
| **v1.0** | **53개 실험 전체 완성** · 3탭 구조 · 반응형 마감 |

> 현재 모든 실험은 `status: planned` 상태이며 허브에서 "준비중"으로 표시됩니다. 단계별 세부 계획은 **[ROADMAP.md](docs/01-planning/ROADMAP.md)** 를 참고하세요.

---

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

```
Copyright (c) 2026 Sungjoo(Dennis) Hwang
```
