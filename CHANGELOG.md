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

(다음 작업 대기 중.)

---

## [1.1.0] - 2026-06-29

v1.1 — 시뮬레이션 정확성 검수, 공유 셸, 실험 간 연결, 허브 UX, 메타/SEO, QA 자동화. (실험 53개는 그대로, 품질·연결·도구를 강화.)

### Fixed (53개 헤드리스 전수 검수 후 발견·수정)
- `03-precision-era/04-volta`: 납–구리(Pb–Cu) 셀당 전압 0.78 V → **0.47 V**(표준 전극전위).
- `06-quantum/05-stern-gerlach`: 공식 박스 차원 오류 `μ_z = ±ħ/2` → **`μ_z = ±μ_B (S_z = ±ħ/2)`**.
- `07-relativity/03-spacetime-curvature`: 슈바르츠실트 해 연도 1919 → **1916**(연표 순서 정정).
- `05-atomic/07-rutherford`: 최근접 거리식의 `b*b*0` 버그 → 충돌 파라미터 `b`에 단조 증가하도록 수정.
- `03-precision-era/02-cavendish`: 비현실적 58° 표시 → 과장 스케일 축소 + 라벨 명확화(실제는 수 mrad).
- `01-ancient/04-ptolemy-copernicus`: 주전원 부호(+→−) 수정 → 천동설 겉보기 경도가 지동설과 정확히 일치(배지·캔버스 일관).
- `04-energy-field/04-faraday`: 자석 극(N/S) SVG↔Canvas 표기 불일치 통일.

### Added
- **공유 셸**: `src/assets/css/exp.css` + `src/assets/js/exp.js`(`SciExp.initTabs/grade/mountRelated`). 신규 페이지 점진 적용(EXPERIMENT-TEMPLATE.md §9).
- **실험 간 연결**: 53개 모든 실험 페이지 하단에 `🔗 이어서 탐험하기`(이전/다음 + 키워드 기반 관련 실험 + 전체 보기). 자기완결 인라인, 163개 링크 전부 유효.
- **허브 UX**(`src/index.html`): URL 해시 상태(공유/북마크), 즐겨찾기(localStorage ⭐ + "즐겨찾기만" 필터), 키보드 단축키(`/` 검색 포커스, `Esc` 검색 비우기).
- **메타/SEO**: `favicon.svg`, OG/Twitter 태그, `sitemap.xml`(54 URL), `robots.txt`.
- **QA 자동화**: `tests/qa.mjs` + `.github/workflows/qa.yml` — 헤드리스 Chromium으로 53개 페이지 + 허브 자동 검증(`npm test`).

### Changed
- `experiments.json` `version` → 1.1.0. `EXPERIMENT-TEMPLATE.md`·`CODING-STANDARDS.md`에 공유 셸·CI 도구 방침 명시(런타임 Zero-Dependency는 유지; 도구는 `src/` 밖이라 미배포).

---

## [1.0.0] - 2026-06-29

**v1.0 — 53개 실험 전부 구현 완료.** 8개 카테고리(고대 ~ 현대 물리학)의 핵심 과학사 실험 53종이 모두 인터랙티브 페이지(🎮 인터랙티브 / 📚 원리 학습 / 📜 역사적 맥락 3탭, Canvas 시뮬레이션, 공식·SVG·퀴즈)로 완성되어 허브에서 활성화되었습니다. 전 페이지를 헤드리스 Chromium으로 자동 검증했습니다.

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
- **Phase 3 실험 11종 추가** (`03-precision-era`·`04-energy-field` 카테고리 완성) — 동일한 3탭·Canvas 규격:
  - `03-precision-era/01-boyle` — 보일의 법칙 (P·V=일정, P∝1/V).
  - `03-precision-era/02-cavendish` — 캐번디시의 중력 상수 측정 (비틀림 저울, F=G·Mm/r²).
  - `03-precision-era/03-coulomb` — 쿨롱의 법칙 (F=k·q₁q₂/r², 인력/척력).
  - `03-precision-era/04-volta` — 볼타의 전지 (총 전압 = 셀 수 × 셀당 기전력).
  - `04-energy-field/01-foucault` — 푸코의 진자 (진동면 회전주기 = 24h/sin(위도)).
  - `04-energy-field/02-joule` — 줄의 열-일 등가 (W=mgh → ΔT, 4.186 J/cal).
  - `04-energy-field/03-carnot` — 카르노 기관 (η = 1 − Tc/Th).
  - `04-energy-field/04-faraday` — 패러데이의 전자기 유도 (EMF = −N·dΦ/dt, 렌츠).
  - `04-energy-field/05-maxwell` — 맥스웰 방정식 (전자기파, c=f·λ=1/√(μ₀ε₀)).
  - `04-energy-field/06-hertz` — 헤르츠의 전자기파 (공진·거리에 따른 수신, 무선의 토대).
  - `04-energy-field/07-boltzmann` — 볼츠만의 통계역학 (맥스웰-볼츠만 분포, S=k·ln W).
- **Phase 4 실험 9종 추가** (`05-atomic` 카테고리 완성) — 동일한 3탭·Canvas 규격:
  - `05-atomic/01-michelson-morley` — 미켈슨-몰리 (간섭계 귀무 결과, 광속 불변).
  - `05-atomic/02-roentgen` — 뢴트겐 X선 (I=I₀·e^(−μx), 물질별 투과).
  - `05-atomic/03-thomson` — 톰슨 음극선 (E·B 편향으로 e/m, v=E/B).
  - `05-atomic/04-planck` — 플랑크 흑체복사 (빈의 변위, 자외선 파탄/양자화).
  - `05-atomic/05-photoelectric` — 광전 효과 (KEmax=hf−W, 문턱 진동수).
  - `05-atomic/06-millikan` — 밀리컨 기름방울 (전하 양자화, q=mgd/V).
  - `05-atomic/07-rutherford` — 러더퍼드 산란 (원자핵 발견, 충돌 파라미터).
  - `05-atomic/08-bohr` — 보어 원자 모형 (Eₙ=−13.6/n², 선 스펙트럼).
  - `05-atomic/09-franck-hertz` — 프랑크-헤르츠 (4.9eV 간격 전류 급감, 준위 양자화).
- **Phase 5 실험 14종 추가** (`06-quantum`·`07-relativity` 카테고리 완성) — 동일한 3탭·Canvas 규격:
  - 양자역학: `01-de-broglie`(물질파 λ=h/p), `02-davisson-germer`(전자 회절), `03-schrodinger`(우물 ψ·Eₙ), `04-uncertainty`(Δx·Δp≥ħ/2), `05-stern-gerlach`(스핀 양자화), `06-quantum-tunneling`(T≈e^(−2κL)), `07-bell-inequality`(CHSH S>2).
  - 상대성·우주론: `01-time-dilation`(γ), `02-length-contraction`(L₀/γ), `03-spacetime-curvature`(측지선), `04-eddington`(빛의 휘어짐), `05-gravitational-lensing`(아인슈타인 고리), `06-hubble`(v=H₀d), `07-cmb`(2.725K 흑체).
- **Phase 6 실험 7종 추가** (`08-modern` 카테고리 완성 → 전체 53/53 달성) — 동일한 3탭·Canvas 규격:
  - `08-modern/01-laser` — 레이저 (유도 방출·반전 분포·발진 문턱).
  - `08-modern/02-superconductivity` — 초전도 (Tc 이하 R=0, 마이스너 자기부상).
  - `08-modern/03-nuclear-fission` — 핵분열 연쇄반응 (증배계수 k, 미임계/임계/초임계).
  - `08-modern/04-gravitational-waves` — 중력파 LIGO (블랙홀 병합 처프 파형).
  - `08-modern/05-black-hole-eht` — 블랙홀 영상화 (r_s=2GM/c², 그림자·광자 고리).
  - `08-modern/06-higgs-boson` — 힉스 보손 (불변질량 125 GeV 봉우리, 통계적 유의성).
  - `08-modern/07-qubit` — 양자컴퓨팅 큐비트 (블로흐 구·중첩·측정 붕괴).
- 실험 페이지 품질 검증: 헤드리스 Chromium(Playwright)으로 53개 전 페이지의 탭 전환·슬라이더/버튼 반응·콘솔 에러를 자동 점검(전부 통과).

### Changed

- `src/data/experiments.json`: 53개 실험(id 1–53) 전부 `status=ready`로 전환 — 8개 카테고리 100% 완료. `version`을 `1.0.0`으로 상향.
- 허브(`src/index.html`)에서 53개 실험 카드가 모두 활성화되어 각 실험 페이지로 링크됨("준비중" 비활성 카드 없음).

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

[Unreleased]: https://github.com/Denny-Hwang/git-science-park/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Denny-Hwang/git-science-park/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Denny-Hwang/git-science-park/compare/v0.0.1...v1.0.0
[0.0.1]: https://github.com/Denny-Hwang/git-science-park/releases/tag/v0.0.1
