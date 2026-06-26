# PRD — 제품 요구사항 정의서 (Product Requirements Document)

> **프로젝트:** Git Science Park (과학사 인터랙티브 실험실 / Interactive Science History Lab)
> **저장소:** https://github.com/Denny-Hwang/git-science-park
> **배포 URL:** https://denny-hwang.github.io/git-science-park/
> **문서 버전:** v1.0
> **작성 기준:** v1 출시 범위

---

## 1. 프로젝트 개요

### 1.1 비전 (Vision)

**Git Science Park**는 과학사의 핵심 실험을 직접 **조작하며 이해하는 인터랙티브 학습 플랫폼**이다. 사용자는 에라토스테네스의 지구 둘레 측정부터 LIGO의 중력파 검출까지, 인류가 자연을 이해해 온 결정적 순간 53개를 화면 위에서 직접 다룬다. 슬라이더를 움직이고 버튼을 누르면 시뮬레이션이 실시간으로 반응하고, 그 결과가 왜 그렇게 나오는지를 원리와 역사의 맥락 속에서 스스로 깨닫게 된다.

목표는 단순한 "읽는 과학사"가 아니라 **"손으로 만지는 과학사"**다. 위대한 과학자가 가졌던 질문을 사용자가 자신의 화면에서 다시 던지고, 그 답을 실험으로 확인하게 만드는 것이 이 프로젝트의 지향점이다.

### 1.2 문제 (Problem)

기존 과학 교육은 다음과 같은 한계를 가진다.

- **수동적 암기 중심:** 공식과 결과만 외우고, 그 공식이 어떤 실험에서 어떻게 도출되었는지는 다루지 않는다.
- **맥락의 단절:** 실험이 등장한 시대 배경, 그 실험이 풀고자 했던 문제, 결과가 이후 과학사에 끼친 영향이 분리되어 전달된다.
- **체험의 부재:** 실제 실험 장비와 시간이 부족해 학생은 "관찰 → 해석"의 능동적 과정을 경험하지 못하고, 교과서 속 정답만 확인한다.
- **흥미 유발 실패:** 과학사의 드라마틱한 발견 과정이 무미건조한 사실 나열로 축소되어, 학습자의 호기심을 끌어내지 못한다.

### 1.3 해결 (Solution)

Git Science Park는 모든 실험을 **"조작(Manipulate) → 관찰(Observe) → 해석(Interpret)"**의 능동적 학습 루프로 재구성한다.

| 단계 | 사용자 행동 | 플랫폼 제공 요소 |
|------|-------------|------------------|
| **조작** | 슬라이더·버튼으로 변수(각도, 질량, 온도, 파장 등)를 바꾼다 | Canvas 기반 실시간 시뮬레이션, 직관적 컨트롤 |
| **관찰** | 변화에 따른 시뮬레이션 결과를 눈으로 확인한다 | 실시간 그래프·수치·애니메이션 |
| **해석** | 왜 그런 결과가 나오는지 원리와 역사로 이해한다 | 원리 학습 탭, 역사적 맥락 탭 |

학습자는 "정답을 받는 사람"이 아니라 "실험을 수행하는 사람"이 된다. 변수를 바꿔 보며 직관을 쌓고, 원리 학습 탭에서 그 직관을 수식으로 정리하며, 역사적 맥락 탭에서 그 발견이 과학사에서 차지하는 의미를 깨닫는다.

---

## 2. 타겟 사용자 (Target Users)

### Primary — 고등학생

- **니즈:** 교과서의 추상적 공식을 직접 조작해 보며 과학에 대한 흥미를 키우고 싶다. 시각적이고 즉각적인 피드백으로 개념을 직관적으로 잡고자 한다.
- **활용 시나리오:** 물리·화학 단원 예습/복습, 자기주도 탐구 활동, 수행평가 보조 자료.

### Secondary — 대학생 / 대학원생

- **니즈:** 과학사·물리학 강의의 보조 자료로 핵심 실험의 메커니즘과 역사적 맥락을 빠르게 파악하고 싶다. 발표·과제에 인용할 정확한 실험 구조와 연대를 찾는다.
- **활용 시나리오:** 교양/전공 강의 보충, 실험 원리 복습, 세미나 발표 준비.

### Tertiary — 일반인 (과학 교양 독자)

- **니즈:** 부담 없이 과학사의 명장면을 체험하며 교양을 쌓고 싶다. 깊은 수식 없이도 "왜 위대한가"를 이해하고 싶다.
- **활용 시나리오:** 여가 시간의 지적 호기심 충족, 과학 다큐멘터리 시청 후 심화 탐색, 자녀와 함께하는 학습.

---

## 3. 핵심 기능 (Core Features)

### 3.1 메인 허브 페이지 (`src/index.html`)

사용자가 처음 만나는 진입점이며, 53개 실험을 탐색·발견하게 만드는 카탈로그다.

- **실험 카드 그리드:** 53개 실험을 카드 형태로 반응형 그리드에 배치. 각 카드는 카테고리 색상, 아이콘, 제목, 과학자, 연도, 난이도(⭐~⭐⭐⭐⭐⭐), 상태 배지를 표시.
- **8개 카테고리 필터:** 고대 / 과학혁명 / 18세기 / 19세기 / 원자의 시대 / 양자역학 / 상대성·우주론 / 현대 물리학 으로 즉시 필터링.
- **5단계 난이도 필터:** difficulty 1~5 기준으로 실험을 걸러 보기.
- **키워드 검색:** 실험명·과학자명·키워드로 실시간 검색.
- **상태 표시:** 모든 실험은 현재 `status=planned`이므로 카드에 **"준비중"**으로 비활성 표시된다. (구현 완료 시 `ready`로 전환되어 활성화)

### 3.2 개별 실험 페이지 (`src/experiments/{category}/{slug}.html`)

각 실험은 독립 실행 가능한 단일 HTML 파일이며, 공통적으로 **3개 탭** 구조를 가진다.

#### 🎮 인터랙티브 (Interactive)

- **Canvas 시뮬레이션:** Canvas API(2D)로 실험을 실시간 렌더링. 필요 시 SVG 다이어그램 병행.
- **조작 컨트롤:** 슬라이더·버튼·토글로 핵심 변수를 직접 조정.
- **실시간 결과 표시:** 변수 변화에 따른 결과(수치·그래프·애니메이션)를 즉시 갱신해 "조작 → 관찰"의 즉각적 피드백 제공.

#### 📚 원리 학습 (Principles)

- **학습 목표:** 이 실험으로 무엇을 이해하게 되는지 명시.
- **핵심 개념 / 공식:** 핵심 물리 개념과 관련 수식을 정리.
- **다이어그램:** 개념을 시각화하는 SVG/그림.
- **오개념 교정:** 학습자가 흔히 빠지는 오해와 올바른 이해를 대비.
- **퀴즈:** 이해도를 점검하는 간단한 문항.

#### 📜 역사적 맥락 (History)

- **과학자 소개:** 실험을 수행한 과학자의 배경과 기여.
- **시대 배경:** 실험이 등장한 시대의 과학적·사회적 맥락.
- **타임라인:** 발견 전후의 주요 사건 흐름.
- **과학사적 의의:** 이 실험이 이후 과학사에 끼친 영향.

---

## 4. 기술 요구사항 (Technical Requirements)

- **단일 HTML 파일:** 각 실험은 `src/experiments/{category}/{slug}.html` 하나로 독립 실행 가능. HTML/CSS/JS를 한 파일에 자족적으로 포함.
- **Zero Dependencies:** HTML5 + CSS3 + Vanilla JavaScript(ES6+)만 사용. Canvas API(2D 시뮬레이션)와 SVG(다이어그램) 외 외부 라이브러리·프레임워크·빌드 도구를 일절 쓰지 않는다.
- **오프라인 실행:** 네트워크 없이도 파일을 직접 열어 동작. 외부 CDN·폰트·스크립트 의존 금지.
- **반응형:** 모바일 / 태블릿 / 데스크톱 모든 화면에서 레이아웃과 시뮬레이션이 적절히 동작.
- **GitHub Pages 배포:** `main` 브랜치 push 시 GitHub Actions(`.github/workflows/deploy.yml`)가 `src/` 폴더를 자동 배포.
- **브라우저 지원:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (IE 미지원).
- **메타데이터 관리:** 모든 실험 메타데이터는 `src/data/experiments.json`에서 단일 관리.

### 4.1 파일/경로 규칙

| 항목 | 규칙 |
|------|------|
| 실험 페이지 파일 | `src/experiments/{category}/{slug}.html` |
| slug 형식 | 카테고리별 2자리 일련번호 + 영문 슬러그 (예: `01-eratosthenes`) |
| 실험 페이지 예시 | `src/experiments/01-ancient/01-eratosthenes.html` |
| 허브에서의 링크 경로 | `./experiments/{category}/{slug}.html` |
| 메타데이터 | `src/data/experiments.json` |
| 허브 | `src/index.html` |

### 4.2 데이터 규약

- **difficulty:** 1~5 (⭐ ~ ⭐⭐⭐⭐⭐).
- **status:** `ready` | `planned` | `in-progress`. (현재 모든 실험은 미구현이므로 `status=planned`, 허브에서 "준비중" 비활성 표시.)
- **3탭 구조:** 모든 실험 페이지는 🎮 인터랙티브 / 📚 원리 학습 / 📜 역사적 맥락 을 반드시 포함.

---

## 5. 범위 (Scope)

### 5.1 In Scope (v1)

- 과학사 핵심 실험 **53개** 전부.
- **8개 카테고리**로 분류된 메인 **허브 페이지**.
- **기본 필터(카테고리 8개 / 난이도 5단계)와 키워드 검색.**
- 각 실험의 **3탭 구조**(인터랙티브 / 원리 학습 / 역사적 맥락).
- GitHub Pages 자동 배포 파이프라인.

### 5.2 Out of Scope (v1)

- **사용자 인증 / 계정 시스템.**
- **진행률·학습 기록 저장.**
- **다국어 지원**(v1은 한국어 단일).
- 서버 사이드 로직·데이터베이스(정적 사이트 원칙 유지).
- 결제·구독 등 수익화 기능.

---

## 6. 성공 지표 (Success Metrics)

| 지표 | 목표 |
|------|------|
| 실험 완성도 | **53개 실험 전부 완성** (`status=ready`) |
| 구조 일관성 | **모든 실험이 3탭 구조**(인터랙티브 / 원리 학습 / 역사적 맥락) 충족 |
| 크로스 브라우저 호환 | **Chrome / Firefox / Safari / Edge** 모두에서 정상 동작 |
| Zero Dependencies | 모든 실험이 외부 라이브러리 없이 오프라인 실행 가능 |
| 반응형 | 모바일 / 태블릿 / 데스크톱 전 화면에서 시뮬레이션·레이아웃 정상 동작 |

---

## 7. 실험 목록 (Experiment Catalog)

**총 53개 / 8개 카테고리.** 카테고리별 개수: 고대 4, 과학혁명 7, 18세기 5, 19세기 7, 원자의 시대 9, 양자역학 7, 상대성·우주론 7, 현대 물리학 7.

#### 01-ancient — 🏛️ 고대 (4개)
1. 에라토스테네스의 지구 둘레 측정 (Eratosthenes Measures the Earth, 기원전 240년경, 에라토스테네스)
2. 아르키메데스의 부력 원리 (Archimedes' Principle of Buoyancy, 기원전 250년경, 아르키메데스)
3. 아르키메데스의 지레 원리 (Archimedes' Law of the Lever, 기원전 250년경, 아르키메데스)
4. 천동설 vs 지동설 (Ptolemy vs Copernicus, 150년 / 1543년, 프톨레마이오스, 코페르니쿠스)

#### 02-scientific-revolution — 🔭 과학혁명 (7개)
5. 케플러의 행성 운동 법칙 (Kepler's Laws of Planetary Motion, 1609년, 요하네스 케플러)
6. 갈릴레오의 자유낙하 (Galileo's Free Fall, 1589년경, 갈릴레오 갈릴레이)
7. 갈릴레오의 경사면 실험 (Galileo's Inclined Plane, 1604년경, 갈릴레오 갈릴레이)
8. 갈릴레오의 망원경 관측 (Galileo's Telescope, 1609년, 갈릴레오 갈릴레이)
9. 뉴턴의 프리즘 분광 (Newton's Prism Experiment, 1666년, 아이작 뉴턴)
10. 뉴턴의 대포 사고실험 (Newton's Cannonball, 1687년, 아이작 뉴턴)
11. 뉴턴의 만유인력 법칙 (Newton's Law of Universal Gravitation, 1687년, 아이작 뉴턴)

#### 03-precision-era — ⚗️ 18세기 (5개)
12. 보일의 법칙 (Boyle's Law, 1662년, 로버트 보일)
13. 캐번디시의 중력 상수 측정 (Cavendish Experiment, 1798년, 헨리 캐번디시)
14. 쿨롱의 법칙 (Coulomb's Law, 1785년, 샤를 드 쿨롱)
15. 볼타의 전지 (Volta's Pile, 1800년, 알레산드로 볼타)
16. 영의 이중 슬릿 실험 (Young's Double-Slit Experiment, 1801년, 토머스 영)

#### 04-energy-field — 🔥 19세기 (7개)
17. 푸코의 진자 (Foucault Pendulum, 1851년, 레옹 푸코)
18. 줄의 열-일 등가 실험 (Joule's Mechanical Equivalent of Heat, 1843년, 제임스 프레스콧 줄)
19. 카르노 기관 (Carnot Engine, 1824년, 사디 카르노)
20. 패러데이의 전자기 유도 (Faraday's Electromagnetic Induction, 1831년, 마이클 패러데이)
21. 맥스웰 방정식 (Maxwell's Equations, 1865년, 제임스 클러크 맥스웰)
22. 헤르츠의 전자기파 실험 (Hertz's Electromagnetic Waves, 1887년, 하인리히 헤르츠)
23. 볼츠만의 통계역학 (Boltzmann's Statistical Mechanics, 1877년, 루트비히 볼츠만)

#### 05-atomic — ⚛️ 원자의 시대 (9개)
24. 미켈슨-몰리 실험 (Michelson-Morley Experiment, 1887년, 앨버트 미켈슨, 에드워드 몰리)
25. 뢴트겐의 X선 발견 (Röntgen's Discovery of X-rays, 1895년, 빌헬름 뢴트겐)
26. 톰슨의 음극선 실험 (Thomson's Cathode Ray Experiment, 1897년, J.J. 톰슨)
27. 플랑크의 흑체복사 (Planck's Blackbody Radiation, 1900년, 막스 플랑크)
28. 광전 효과 (Photoelectric Effect, 1905년, 알베르트 아인슈타인)
29. 밀리컨의 기름방울 실험 (Millikan's Oil Drop Experiment, 1909년, 로버트 밀리컨)
30. 러더퍼드 산란 실험 (Rutherford Scattering, 1911년, 어니스트 러더퍼드)
31. 보어의 원자 모형 (Bohr's Atomic Model, 1913년, 닐스 보어)
32. 프랑크-헤르츠 실험 (Franck-Hertz Experiment, 1914년, 제임스 프랑크, 구스타프 헤르츠)

#### 06-quantum — 🌊 양자역학 (7개)
33. 드브로이 물질파 (de Broglie Matter Waves, 1924년, 루이 드브로이)
34. 데이비슨-거머 실험 (Davisson-Germer Experiment, 1927년, 클린턴 데이비슨, 레스터 거머)
35. 슈뢰딩거 방정식 (Schrödinger Equation, 1926년, 에르빈 슈뢰딩거)
36. 하이젠베르크 불확정성 원리 (Heisenberg Uncertainty Principle, 1927년, 베르너 하이젠베르크)
37. 슈테른-게를라흐 실험 (Stern-Gerlach Experiment, 1922년, 오토 슈테른, 발터 게를라흐)
38. 양자 터널링 (Quantum Tunneling, 1928년, 조지 가모프)
39. 벨 부등식과 얽힘 (Bell's Inequality, 1964년, 존 스튜어트 벨)

#### 07-relativity — 🌌 상대성·우주론 (7개)
40. 시간 지연 (Time Dilation, 1905년, 알베르트 아인슈타인)
41. 길이 수축 (Length Contraction, 1905년, 알베르트 아인슈타인)
42. 시공간 곡률 (Spacetime Curvature, 1915년, 알베르트 아인슈타인)
43. 에딩턴의 일식 관측 (Eddington's Eclipse Expedition, 1919년, 아서 에딩턴)
44. 중력 렌즈 (Gravitational Lensing, 1936년, 알베르트 아인슈타인)
45. 허블의 우주 팽창 (Hubble's Expanding Universe, 1929년, 에드윈 허블)
46. 우주배경복사 발견 (Discovery of the CMB, 1965년, 펜지어스, 윌슨)

#### 08-modern — 🔬 현대 물리학 (7개)
47. 레이저의 원리 (How a Laser Works, 1960년, 시어도어 메이먼)
48. 초전도 현상 (Superconductivity, 1911년, 하이케 카메를링 오너스)
49. 핵분열 연쇄반응 (Nuclear Fission, 1938년, 한, 슈트라스만, 마이트너)
50. 중력파 검출 (LIGO) (Gravitational Waves (LIGO), 2015년, LIGO 협력단)
51. 블랙홀 영상화 (EHT) (Black Hole Imaging (EHT), 2019년, 사건의 지평선 망원경 협력단)
52. 힉스 보손 발견 (Discovery of the Higgs Boson, 2012년, CERN (힉스 메커니즘))
53. 양자컴퓨팅 큐비트 (Quantum Computing Qubit, 2019년, 양자컴퓨팅 연구진)

---

## 8. 부록: 카테고리 요약

| 코드 | 카테고리 | 부제 | 색상 | 실험 수 |
|------|----------|------|------|---------|
| 01-ancient | 🏛️ 고대 (Ancient) | 측정과 기하학의 탄생 | `#8B4513` | 4 |
| 02-scientific-revolution | 🔭 과학혁명 (Scientific Revolution) | 실험과 수학의 결합 | `#2E4A62` | 7 |
| 03-precision-era | ⚗️ 18세기 (Precision Era) | 정밀 측정의 시대 | `#4A5568` | 5 |
| 04-energy-field | 🔥 19세기 (Energy & Field) | 에너지와 장의 시대 | `#C53030` | 7 |
| 05-atomic | ⚛️ 원자의 시대 (Atomic Age) | 물질의 궁극 구조 | `#2B6CB0` | 9 |
| 06-quantum | 🌊 양자역학 (Quantum Mechanics) | 양자역학의 형성 | `#6B46C1` | 7 |
| 07-relativity | 🌌 상대성·우주론 (Relativity & Cosmology) | 상대성이론과 우주론 | `#1A365D` | 7 |
| 08-modern | 🔬 현대 물리학 (Modern Physics) | 극한의 탐험 | `#234E52` | 7 |
| **합계** | | | | **53** |
