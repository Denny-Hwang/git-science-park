# 변경 이력 (Changelog)

이 프로젝트의 모든 주목할 만한 변경 사항은 이 파일에 기록됩니다.

이 문서의 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르며,
버전 관리는 [유의적 버전(Semantic Versioning)](https://semver.org/lang/ko/)을 준수합니다.

## 버전 규칙

버전은 `MAJOR.MINOR.PATCH` 형식을 사용합니다.

| 구분      | 증가 조건                                                                 |
| --------- | ------------------------------------------------------------------------- |
| **MAJOR** | 기존과 호환되지 않는 변경(허브 구조 개편, 데이터 스키마 비호환 변경 등)    |
| **MINOR** | 하위 호환을 유지하는 기능 추가(새 실험 구현, 새 카테고리/필터 기능 등)     |
| **PATCH** | 하위 호환을 유지하는 버그 수정 및 사소한 개선(오타, 스타일 보정 등)        |

> 정식 출시(1.0.0) 이전 단계입니다. `0.x.y` 버전에서는 MINOR 증가도
> 비호환 변경을 포함할 수 있으며, API/구조가 안정화되는 시점에 1.0.0을 부여합니다.

### 변경 유형 분류

각 릴리스 항목은 다음 분류를 사용합니다.

- **Added** — 새로 추가된 기능
- **Changed** — 기존 기능의 변경
- **Deprecated** — 곧 제거될 예정인 기능
- **Removed** — 제거된 기능
- **Fixed** — 버그 수정
- **Security** — 보안 관련 수정

---

## [Unreleased]

아직 릴리스되지 않은 작업 항목입니다.

### Added

- **파일럿 실험 5종 구현** (ROADMAP Phase 1 — v0.1 목표 "허브 + 5개 실험" 달성) — 인터랙티브 시뮬레이션 + 3개 탭(🎮 인터랙티브 / 📚 원리 학습 / 📜 역사적 맥락) 완성:
  - `01-ancient/01-eratosthenes` — 에라토스테네스의 지구 둘레 측정 (그림자 각도·도시 거리 슬라이더로 둘레 계산, 실제값 대비 오차 표시).
  - `01-ancient/02-archimedes-buoyancy` — 아르키메데스의 부력 원리 (물체/유체 밀도로 부력·잠긴 비율 계산, 뜸/가라앉음 시각화).
  - `02-scientific-revolution/02-galileo-freefall` — 갈릴레오의 자유낙하 (질량과 무관하게 동시 착지하는 낙하 애니메이션, 중력 프리셋/공기저항 토글).
  - `02-scientific-revolution/05-newton-prism` — 뉴턴의 프리즘 분광 (입사각·꼭지각·분산으로 백색광이 무지개로 분해, 빨강/보라 분산각 표시).
  - `03-precision-era/05-young-double-slit` — 영의 이중 슬릿 (파장·슬릿 간격·스크린 거리로 간섭무늬와 무늬 간격 Δy 계산).
  - 각 페이지: Canvas 시뮬레이션, 실시간 결과(result-box), 공식·SVG 다이어그램·퀴즈, 연표·과학사적 의의 포함. Zero Dependencies 단일 HTML.
- **Phase 2 실험 7종 추가** (ROADMAP Phase 2 — `01-ancient`·`02-scientific-revolution` 카테고리 완성) — 동일한 3탭·Canvas 규격:
  - `01-ancient/03-archimedes-lever` — 아르키메데스의 지레 원리 (토크 평형 F₁d₁=F₂d₂, 역학적 이득).
  - `01-ancient/04-ptolemy-copernicus` — 천동설 vs 지동설 (주전원 vs 태양중심으로 화성 역행 비교, 순행/역행 판정).
  - `02-scientific-revolution/01-kepler` — 케플러의 행성 운동 법칙 (타원·면적속도 일정·T²∝a³).
  - `02-scientific-revolution/03-galileo-incline` — 갈릴레오의 경사면 실험 (a=g·sinθ, 거리비 1:3:5:7).
  - `02-scientific-revolution/04-galileo-telescope` — 갈릴레오의 망원경 관측 (배율 M=f_대물/f_접안, 목성 4대 위성).
  - `02-scientific-revolution/06-newton-cannon` — 뉴턴의 대포 사고실험 (발사 속도 → 추락/원궤도/타원/탈출).
  - `02-scientific-revolution/07-newton-gravitation` — 뉴턴의 만유인력 법칙 (F=G·m₁m₂/r², 역제곱).
- 실험 페이지 품질 검증: 헤드리스 Chromium(Playwright)으로 전 페이지의 탭 전환·슬라이더 반응·콘솔 에러를 자동 점검.

### Changed

- `src/data/experiments.json`: 구현 완료한 12개 실험(id 1–11, 16)의 `status`를 `ready`로 전환 — `01-ancient`(4/4)·`02-scientific-revolution`(7/7) 카테고리 100% 완료.
- 허브(`src/index.html`)에서 `status=ready` 실험 카드가 활성화되어 해당 실험 페이지로 링크됨(나머지 41개는 "준비중" 비활성 유지).

### 예정 (Planned)

- 남은 41개 실험의 인터랙티브 페이지 단계적 구현 (ROADMAP Phase 3 이후).
- Canvas 공통 유틸리티·레이아웃 셸(shell) 추출로 중복 축소.

---

## [0.0.1] - 2026-06-26

프로젝트 초기 설정. 저장소 골격과 기획·설계·개발 문서, 데이터 메타데이터,
메인 허브 페이지, 배포 파이프라인을 갖춰 실험 구현을 시작할 수 있는 기반을 마련했습니다.

### Added

- **프로젝트 구조 스캐폴딩** — 폴더/파일 골격 구성.
  - `docs/` — 기획·설계·개발 문서 모음.
  - `src/` — 정적 웹사이트 소스(허브, 실험 페이지, 데이터).
  - `.github/` — GitHub Actions 워크플로우.
- **기획 문서**
  - `docs/PRD.md` — 제품 요구사항 정의서.
  - `docs/USER-STORIES.md` — 사용자 스토리.
  - `docs/ROADMAP.md` — 개발 로드맵.
- **설계 문서**
  - `docs/ARCHITECTURE.md` — 시스템 아키텍처(순수 정적 웹, Zero Dependencies).
  - `docs/UI-DESIGN.md` — UI/UX 디자인 가이드(반응형: 모바일/태블릿/데스크톱).
  - `docs/DATA-MODEL.md` — 데이터 모델 규약(`difficulty` 1~5, `status` 값 정의 등).
  - `docs/EXPERIMENT-TEMPLATE.md` — 실험 페이지 표준 템플릿(3탭 구조).
- **개발 문서**
  - `docs/SETUP.md` — 개발 환경 설정 가이드.
  - `docs/CODING-STANDARDS.md` — 코딩 표준(HTML5 + CSS3 + Vanilla JS ES6+).
  - `docs/GIT-WORKFLOW.md` — Git 브랜치/커밋 워크플로우.
- **데이터**
  - `src/data/experiments.json` — 총 53개 실험 메타데이터와 8개 카테고리 정의.
    - 카테고리별 실험 수: 고대 4, 과학혁명 7, 18세기 5, 19세기 7, 원자의 시대 9, 양자역학 7, 상대성·우주론 7, 현대 물리학 7.
    - 초기 상태: 모든 실험 `status=planned`(허브에서 "준비중" 비활성 표시).
- **메인 허브 페이지**
  - `src/index.html` — 카테고리 필터, 난이도 필터, 검색, 카드 그리드를 포함한 진입점.
- **배포 파이프라인**
  - `.github/workflows/deploy.yml` — `main` 브랜치 push 시 `src/` 폴더를 GitHub Pages로 자동 배포.
- **저장소 메타 문서**
  - `README.md` — 프로젝트 개요 및 사용 안내.
  - `CONTRIBUTING.md` — 기여 가이드.
  - `CHANGELOG.md` — 본 변경 이력 문서.
  - `LICENSE` — MIT License.

[Unreleased]: https://github.com/Denny-Hwang/git-science-park/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/Denny-Hwang/git-science-park/releases/tag/v0.0.1
