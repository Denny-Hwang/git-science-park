# 데이터 모델 (Data Model)

Git Science Park의 모든 실험 메타데이터는 단일 JSON 파일에 정의된다. 허브 페이지(`src/index.html`)는 이 파일을 fetch 하여 카테고리 섹션과 실험 카드를 동적으로 렌더링한다. 빌드 도구나 외부 라이브러리 없이(Zero Dependencies) 브라우저가 직접 JSON을 읽는 구조이므로, 스키마 규약을 엄격히 지키는 것이 데이터 무결성의 전부다.

---

## 1. 파일 위치

| 항목 | 값 |
|---|---|
| 경로 | `src/data/experiments.json` |
| 형식 | UTF-8 인코딩, JSON (주석 없음) |
| 소비자 | `src/index.html` (허브)에서 `fetch('./data/experiments.json')`로 로드 |
| 인코딩 주의 | 한글·이모지를 포함하므로 반드시 UTF-8(BOM 없음)로 저장 |

이 파일은 데이터 단일 출처(single source of truth)다. 실험을 추가/수정/삭제할 때는 HTML 파일과 이 JSON 두 곳을 함께 갱신해야 한다.

---

## 2. 스키마 정의

최상위 객체는 두 개의 배열(`categories`, `experiments`)과 메타 필드(`version`, `generated`)로 구성된다.

```jsonc
{
  "version": "0.0.1",        // 데이터 스키마/콘텐츠 버전
  "generated": "...",        // 생성 메모 (자유 문자열)
  "categories": [ ... ],     // 카테고리 정의 배열 (길이 8)
  "experiments": [ ... ]     // 실험 정의 배열 (길이 53)
}
```

### 2.1 최상위 필드

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `version` | `string` | ✅ | 데이터 파일의 버전. 시맨틱 버저닝 권장(예 `0.0.1`). |
| `generated` | `string` | ✅ | 생성/갱신 방법을 적는 메모성 문자열. |
| `categories` | `object[]` | ✅ | 카테고리 정의 배열. 정확히 8개. |
| `experiments` | `object[]` | ✅ | 실험 정의 배열. 정확히 53개. |

### 2.2 `categories[]` 객체

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | `string` | ✅ | 카테고리 식별자. 실험 폴더명과 동일(예 `01-ancient`). `experiments[].category`가 이 값을 참조한다. |
| `name` | `string` | ✅ | 한글 이름(예 `고대`). |
| `nameEn` | `string` | ✅ | 영문 이름(예 `Ancient`). |
| `icon` | `string` | ✅ | 카테고리 대표 이모지(예 `🏛️`). |
| `color` | `string` | ✅ | 카테고리 테마 색상. `#RRGGBB` 형식의 hex(예 `#8B4513`). |
| `description` | `string` | 선택 | 한 줄 태그라인(예 `측정과 기하학의 탄생`). |

### 2.3 `experiments[]` 객체

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | `number` | ✅ | 전역 고유 실험 번호. 1~53의 정수. 카테고리를 가로질러 연속한다. |
| `slug` | `string` | ✅ | 파일명 stem. `NN-name` 형식(예 `01-eratosthenes`). 카테고리별로 `01`부터 시작하는 2자리 일련번호 + 영문 슬러그. HTML 파일명·링크 경로 구성에 사용. |
| `category` | `string` | ✅ | 소속 카테고리 `id`(예 `01-ancient`). `categories[].id` 중 하나와 일치해야 한다. |
| `title` | `string` | ✅ | 한글 제목(예 `에라토스테네스의 지구 둘레 측정`). |
| `titleEn` | `string` | ✅ | 영문 제목(예 `Eratosthenes Measures the Earth`). |
| `year` | `string` | ✅ | 연도 문자열. 기원전·범위 표기를 허용하므로 숫자가 아닌 문자열(예 `기원전 240년경`, `150년 / 1543년`). |
| `scientist` | `string` | ✅ | 과학자명. 여러 명일 경우 쉼표로 구분(예 `프톨레마이오스, 코페르니쿠스`). |
| `difficulty` | `number` | ✅ | 난이도. 1~5의 정수(아래 난이도 기준 표 참조). |
| `description` | `string` | ✅ | 한 줄 설명. 실험 카드에 노출. |
| `keywords` | `string[]` | ✅ | 검색·필터용 키워드 배열. 통상 3~5개. |
| `status` | `string` | ✅ | 구현 상태. `"ready" \| "planned" \| "in-progress"` 중 하나. 현재 전 실험은 미구현이므로 모두 `"planned"`이며, 허브에서 "준비중"으로 비활성 표시된다. |

#### status 값 정의

| 값 | 의미 | 허브 표시 |
|---|---|---|
| `ready` | 실험 페이지가 완성되어 정상 동작 | 활성 카드(클릭 가능) |
| `in-progress` | 작업 중(부분 구현) | 활성 또는 "작업 중" 표시 |
| `planned` | 아직 미구현(메타데이터만 존재) | "준비중" 비활성 카드 |

### 2.4 파일명 규칙 (경로 매핑)

`slug`와 `category`로부터 실험 페이지 경로가 결정된다.

| 항목 | 패턴 | 예시 |
|---|---|---|
| 실험 페이지 파일 | `src/experiments/{category}/{slug}.html` | `src/experiments/01-ancient/01-eratosthenes.html` |
| 허브에서의 링크 | `./experiments/{category}/{slug}.html` | `./experiments/01-ancient/01-eratosthenes.html` |

> 규약 정리
> - `category`는 폴더명이자 `categories[].id`와 동일하다.
> - `slug`는 파일명 stem이며 `NN-name` 형식이다(카테고리별 2자리 번호 + 영문 슬러그).
> - 각 실험은 독립 실행 가능한 단일 HTML 파일이며, 페이지 내부는 3개 탭(🎮 인터랙티브 / 📚 원리 학습 / 📜 역사적 맥락)으로 구성된다.

---

## 3. 난이도 기준

`difficulty` 필드는 1~5의 정수로, 학습 대상 수준을 나타낸다. 허브에서는 별(⭐)로 표기한다.

| 난이도 | 표기 | 수준 | 대상 |
|---|---|---|---|
| 1 | ⭐ | 입문 | 고등학생 |
| 2 | ⭐⭐ | 기초 | 고교 심화 / 대학 교양 |
| 3 | ⭐⭐⭐ | 중급 | 대학 전공 입문 |
| 4 | ⭐⭐⭐⭐ | 심화 | 대학 전공 |
| 5 | ⭐⭐⭐⭐⭐ | 전문 | 대학원 |

---

## 4. 카테고리 정의

총 8개 카테고리. `id`는 폴더명이며, 각 카테고리는 고유한 테마 색상(`color`)을 가진다.

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

### 카테고리별 실험 개수

총 53개 실험이 8개 카테고리에 다음과 같이 분포한다.

| 카테고리 | 실험 수 | `id` 범위 |
|---|---|---|
| 01-ancient | 4 | 1–4 |
| 02-scientific-revolution | 7 | 5–11 |
| 03-precision-era | 5 | 12–16 |
| 04-energy-field | 7 | 17–23 |
| 05-atomic | 9 | 24–32 |
| 06-quantum | 7 | 33–39 |
| 07-relativity | 7 | 40–46 |
| 08-modern | 7 | 47–53 |
| **합계** | **53** | **1–53** |

---

## 5. 전체 데이터 (`experiments.json`)

아래는 `src/data/experiments.json`의 실제 내용 전체다.

```json
{
  "version": "0.0.1",
  "generated": "initial scaffold",
  "categories": [
    {
      "id": "01-ancient",
      "name": "고대",
      "nameEn": "Ancient",
      "icon": "🏛️",
      "color": "#8B4513",
      "description": "측정과 기하학의 탄생"
    },
    {
      "id": "02-scientific-revolution",
      "name": "과학혁명",
      "nameEn": "Scientific Revolution",
      "icon": "🔭",
      "color": "#2E4A62",
      "description": "실험과 수학의 결합"
    },
    {
      "id": "03-precision-era",
      "name": "18세기",
      "nameEn": "Precision Era",
      "icon": "⚗️",
      "color": "#4A5568",
      "description": "정밀 측정의 시대"
    },
    {
      "id": "04-energy-field",
      "name": "19세기",
      "nameEn": "Energy & Field",
      "icon": "🔥",
      "color": "#C53030",
      "description": "에너지와 장의 시대"
    },
    {
      "id": "05-atomic",
      "name": "원자의 시대",
      "nameEn": "Atomic Age",
      "icon": "⚛️",
      "color": "#2B6CB0",
      "description": "물질의 궁극 구조"
    },
    {
      "id": "06-quantum",
      "name": "양자역학",
      "nameEn": "Quantum Mechanics",
      "icon": "🌊",
      "color": "#6B46C1",
      "description": "양자역학의 형성"
    },
    {
      "id": "07-relativity",
      "name": "상대성·우주론",
      "nameEn": "Relativity & Cosmology",
      "icon": "🌌",
      "color": "#1A365D",
      "description": "상대성이론과 우주론"
    },
    {
      "id": "08-modern",
      "name": "현대 물리학",
      "nameEn": "Modern Physics",
      "icon": "🔬",
      "color": "#234E52",
      "description": "극한의 탐험"
    }
  ],
  "experiments": [
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
      "keywords": [
        "지구 둘레",
        "그림자",
        "각도",
        "기하학",
        "측정"
      ],
      "status": "planned"
    },
    {
      "id": 2,
      "slug": "02-archimedes-buoyancy",
      "category": "01-ancient",
      "title": "아르키메데스의 부력 원리",
      "titleEn": "Archimedes' Principle of Buoyancy",
      "year": "기원전 250년경",
      "scientist": "아르키메데스",
      "difficulty": 1,
      "description": "물체가 밀어낸 물의 무게만큼 부력을 받는 원리를 관찰한다.",
      "keywords": [
        "부력",
        "밀도",
        "유레카",
        "왕관",
        "아르키메데스 원리"
      ],
      "status": "planned"
    },
    {
      "id": 3,
      "slug": "03-archimedes-lever",
      "category": "01-ancient",
      "title": "아르키메데스의 지레 원리",
      "titleEn": "Archimedes' Law of the Lever",
      "year": "기원전 250년경",
      "scientist": "아르키메데스",
      "difficulty": 1,
      "description": "받침점과 거리로 힘을 증폭하는 지레의 평형을 탐구한다.",
      "keywords": [
        "지레",
        "받침점",
        "토크",
        "평형",
        "역학적 이득"
      ],
      "status": "planned"
    },
    {
      "id": 4,
      "slug": "04-ptolemy-copernicus",
      "category": "01-ancient",
      "title": "천동설 vs 지동설",
      "titleEn": "Ptolemy vs Copernicus",
      "year": "150년 / 1543년",
      "scientist": "프톨레마이오스, 코페르니쿠스",
      "difficulty": 2,
      "description": "주전원 모형과 태양 중심 모형으로 행성의 역행을 비교한다.",
      "keywords": [
        "천동설",
        "지동설",
        "주전원",
        "역행운동",
        "태양중심설"
      ],
      "status": "planned"
    },
    {
      "id": 5,
      "slug": "01-kepler",
      "category": "02-scientific-revolution",
      "title": "케플러의 행성 운동 법칙",
      "titleEn": "Kepler's Laws of Planetary Motion",
      "year": "1609년",
      "scientist": "요하네스 케플러",
      "difficulty": 3,
      "description": "타원 궤도와 면적 속도 일정 법칙을 시뮬레이션한다.",
      "keywords": [
        "타원궤도",
        "면적속도",
        "케플러 법칙",
        "행성운동",
        "공전주기"
      ],
      "status": "planned"
    },
    {
      "id": 6,
      "slug": "02-galileo-freefall",
      "category": "02-scientific-revolution",
      "title": "갈릴레오의 자유낙하",
      "titleEn": "Galileo's Free Fall",
      "year": "1589년경",
      "scientist": "갈릴레오 갈릴레이",
      "difficulty": 1,
      "description": "질량과 무관하게 모든 물체가 같은 가속도로 떨어짐을 확인한다.",
      "keywords": [
        "자유낙하",
        "중력가속도",
        "질량 무관",
        "피사의 탑",
        "등가속도"
      ],
      "status": "planned"
    },
    {
      "id": 7,
      "slug": "03-galileo-incline",
      "category": "02-scientific-revolution",
      "title": "갈릴레오의 경사면 실험",
      "titleEn": "Galileo's Inclined Plane",
      "year": "1604년경",
      "scientist": "갈릴레오 갈릴레이",
      "difficulty": 2,
      "description": "경사면에서 거리와 시간의 제곱 관계로 가속도를 측정한다.",
      "keywords": [
        "경사면",
        "등가속도",
        "거리-시간 제곱",
        "운동학",
        "갈릴레오"
      ],
      "status": "planned"
    },
    {
      "id": 8,
      "slug": "04-galileo-telescope",
      "category": "02-scientific-revolution",
      "title": "갈릴레오의 망원경 관측",
      "titleEn": "Galileo's Telescope",
      "year": "1609년",
      "scientist": "갈릴레오 갈릴레이",
      "difficulty": 2,
      "description": "목성의 위성과 달 표면을 망원경으로 관측해 천문학을 바꾼다.",
      "keywords": [
        "망원경",
        "목성 위성",
        "달 표면",
        "천문 관측",
        "갈릴레이 위성"
      ],
      "status": "planned"
    },
    {
      "id": 9,
      "slug": "05-newton-prism",
      "category": "02-scientific-revolution",
      "title": "뉴턴의 프리즘 분광",
      "titleEn": "Newton's Prism Experiment",
      "year": "1666년",
      "scientist": "아이작 뉴턴",
      "difficulty": 2,
      "description": "백색광이 프리즘을 지나 무지개 스펙트럼으로 분해됨을 본다.",
      "keywords": [
        "프리즘",
        "분광",
        "스펙트럼",
        "빛의 굴절",
        "색"
      ],
      "status": "planned"
    },
    {
      "id": 10,
      "slug": "06-newton-cannon",
      "category": "02-scientific-revolution",
      "title": "뉴턴의 대포 사고실험",
      "titleEn": "Newton's Cannonball",
      "year": "1687년",
      "scientist": "아이작 뉴턴",
      "difficulty": 2,
      "description": "발사 속도를 높이면 포탄이 궤도를 도는 인공위성이 됨을 보인다.",
      "keywords": [
        "인공위성",
        "궤도운동",
        "탈출속도",
        "포물선",
        "만유인력"
      ],
      "status": "planned"
    },
    {
      "id": 11,
      "slug": "07-newton-gravitation",
      "category": "02-scientific-revolution",
      "title": "뉴턴의 만유인력 법칙",
      "titleEn": "Newton's Law of Universal Gravitation",
      "year": "1687년",
      "scientist": "아이작 뉴턴",
      "difficulty": 3,
      "description": "두 질량 사이의 거리 제곱에 반비례하는 인력을 탐구한다.",
      "keywords": [
        "만유인력",
        "역제곱 법칙",
        "중력",
        "질량",
        "행성 운동"
      ],
      "status": "planned"
    },
    {
      "id": 12,
      "slug": "01-boyle",
      "category": "03-precision-era",
      "title": "보일의 법칙",
      "titleEn": "Boyle's Law",
      "year": "1662년",
      "scientist": "로버트 보일",
      "difficulty": 2,
      "description": "일정 온도에서 기체의 압력과 부피가 반비례함을 측정한다.",
      "keywords": [
        "보일 법칙",
        "압력",
        "부피",
        "기체",
        "반비례"
      ],
      "status": "planned"
    },
    {
      "id": 13,
      "slug": "02-cavendish",
      "category": "03-precision-era",
      "title": "캐번디시의 중력 상수 측정",
      "titleEn": "Cavendish Experiment",
      "year": "1798년",
      "scientist": "헨리 캐번디시",
      "difficulty": 4,
      "description": "비틀림 저울로 미세한 인력을 재어 지구의 무게를 잰다.",
      "keywords": [
        "중력상수",
        "비틀림 저울",
        "지구 질량",
        "G",
        "미세 측정"
      ],
      "status": "planned"
    },
    {
      "id": 14,
      "slug": "03-coulomb",
      "category": "03-precision-era",
      "title": "쿨롱의 법칙",
      "titleEn": "Coulomb's Law",
      "year": "1785년",
      "scientist": "샤를 드 쿨롱",
      "difficulty": 3,
      "description": "전하 사이의 힘이 거리 제곱에 반비례함을 비틀림 저울로 본다.",
      "keywords": [
        "쿨롱 법칙",
        "전하",
        "정전기력",
        "역제곱",
        "비틀림 저울"
      ],
      "status": "planned"
    },
    {
      "id": 15,
      "slug": "04-volta",
      "category": "03-precision-era",
      "title": "볼타의 전지",
      "titleEn": "Volta's Pile",
      "year": "1800년",
      "scientist": "알레산드로 볼타",
      "difficulty": 2,
      "description": "서로 다른 금속과 전해질로 지속적인 전류를 만든다.",
      "keywords": [
        "볼타 전지",
        "전류",
        "전위차",
        "전기화학",
        "배터리"
      ],
      "status": "planned"
    },
    {
      "id": 16,
      "slug": "05-young-double-slit",
      "category": "03-precision-era",
      "title": "영의 이중 슬릿 실험",
      "titleEn": "Young's Double-Slit Experiment",
      "year": "1801년",
      "scientist": "토머스 영",
      "difficulty": 3,
      "description": "두 슬릿을 지난 빛의 간섭무늬로 빛의 파동성을 증명한다.",
      "keywords": [
        "이중슬릿",
        "간섭",
        "파동성",
        "회절",
        "간섭무늬"
      ],
      "status": "planned"
    },
    {
      "id": 17,
      "slug": "01-foucault",
      "category": "04-energy-field",
      "title": "푸코의 진자",
      "titleEn": "Foucault Pendulum",
      "year": "1851년",
      "scientist": "레옹 푸코",
      "difficulty": 3,
      "description": "진자의 진동면 회전으로 지구의 자전을 직접 보인다.",
      "keywords": [
        "푸코 진자",
        "지구 자전",
        "코리올리",
        "진동면",
        "위도"
      ],
      "status": "planned"
    },
    {
      "id": 18,
      "slug": "02-joule",
      "category": "04-energy-field",
      "title": "줄의 열-일 등가 실험",
      "titleEn": "Joule's Mechanical Equivalent of Heat",
      "year": "1843년",
      "scientist": "제임스 프레스콧 줄",
      "difficulty": 3,
      "description": "낙하 추가 물을 휘저어 일이 열로 바뀌는 양을 측정한다.",
      "keywords": [
        "열-일 등가",
        "에너지 보존",
        "열역학 제1법칙",
        "줄",
        "일"
      ],
      "status": "planned"
    },
    {
      "id": 19,
      "slug": "03-carnot",
      "category": "04-energy-field",
      "title": "카르노 기관",
      "titleEn": "Carnot Engine",
      "year": "1824년",
      "scientist": "사디 카르노",
      "difficulty": 4,
      "description": "이상적인 열기관의 최대 효율과 카르노 순환을 탐구한다.",
      "keywords": [
        "카르노 순환",
        "열효율",
        "열역학 제2법칙",
        "엔트로피",
        "열기관"
      ],
      "status": "planned"
    },
    {
      "id": 20,
      "slug": "04-faraday",
      "category": "04-energy-field",
      "title": "패러데이의 전자기 유도",
      "titleEn": "Faraday's Electromagnetic Induction",
      "year": "1831년",
      "scientist": "마이클 패러데이",
      "difficulty": 3,
      "description": "자기장의 변화가 코일에 전류를 유도함을 관찰한다.",
      "keywords": [
        "전자기 유도",
        "패러데이 법칙",
        "자속",
        "기전력",
        "발전기"
      ],
      "status": "planned"
    },
    {
      "id": 21,
      "slug": "05-maxwell",
      "category": "04-energy-field",
      "title": "맥스웰 방정식",
      "titleEn": "Maxwell's Equations",
      "year": "1865년",
      "scientist": "제임스 클러크 맥스웰",
      "difficulty": 5,
      "description": "전기와 자기를 통합하고 빛이 전자기파임을 예측한다.",
      "keywords": [
        "맥스웰 방정식",
        "전자기파",
        "전자기 통합",
        "빛의 속도",
        "장"
      ],
      "status": "planned"
    },
    {
      "id": 22,
      "slug": "06-hertz",
      "category": "04-energy-field",
      "title": "헤르츠의 전자기파 실험",
      "titleEn": "Hertz's Electromagnetic Waves",
      "year": "1887년",
      "scientist": "하인리히 헤르츠",
      "difficulty": 3,
      "description": "불꽃 방전으로 전자기파를 발생·검출해 맥스웰을 증명한다.",
      "keywords": [
        "전자기파",
        "헤르츠",
        "공진",
        "무선",
        "빛의 속도"
      ],
      "status": "planned"
    },
    {
      "id": 23,
      "slug": "07-boltzmann",
      "category": "04-energy-field",
      "title": "볼츠만의 통계역학",
      "titleEn": "Boltzmann's Statistical Mechanics",
      "year": "1877년",
      "scientist": "루트비히 볼츠만",
      "difficulty": 5,
      "description": "수많은 입자의 속도 분포와 엔트로피의 통계적 의미를 본다.",
      "keywords": [
        "통계역학",
        "엔트로피",
        "맥스웰-볼츠만 분포",
        "미시상태",
        "확률"
      ],
      "status": "planned"
    },
    {
      "id": 24,
      "slug": "01-michelson-morley",
      "category": "05-atomic",
      "title": "미켈슨-몰리 실험",
      "titleEn": "Michelson-Morley Experiment",
      "year": "1887년",
      "scientist": "앨버트 미켈슨, 에드워드 몰리",
      "difficulty": 4,
      "description": "간섭계로 에테르를 찾으려다 빛의 속도 불변을 발견한다.",
      "keywords": [
        "에테르",
        "간섭계",
        "광속 불변",
        "미켈슨",
        "상대성"
      ],
      "status": "planned"
    },
    {
      "id": 25,
      "slug": "02-roentgen",
      "category": "05-atomic",
      "title": "뢴트겐의 X선 발견",
      "titleEn": "Röntgen's Discovery of X-rays",
      "year": "1895년",
      "scientist": "빌헬름 뢴트겐",
      "difficulty": 2,
      "description": "음극선관에서 나온 미지의 광선이 물체를 투과함을 발견한다.",
      "keywords": [
        "X선",
        "뢴트겐",
        "투과",
        "방사선",
        "음극선관"
      ],
      "status": "planned"
    },
    {
      "id": 26,
      "slug": "03-thomson",
      "category": "05-atomic",
      "title": "톰슨의 음극선 실험",
      "titleEn": "Thomson's Cathode Ray Experiment",
      "year": "1897년",
      "scientist": "J.J. 톰슨",
      "difficulty": 3,
      "description": "전기장·자기장으로 음극선을 휘어 전자의 비전하를 잰다.",
      "keywords": [
        "전자 발견",
        "음극선",
        "비전하",
        "e/m",
        "톰슨"
      ],
      "status": "planned"
    },
    {
      "id": 27,
      "slug": "04-planck",
      "category": "05-atomic",
      "title": "플랑크의 흑체복사",
      "titleEn": "Planck's Blackbody Radiation",
      "year": "1900년",
      "scientist": "막스 플랑크",
      "difficulty": 4,
      "description": "에너지의 양자화로 흑체 복사 스펙트럼을 설명한다.",
      "keywords": [
        "흑체복사",
        "양자화",
        "플랑크 상수",
        "자외선 파탄",
        "양자"
      ],
      "status": "planned"
    },
    {
      "id": 28,
      "slug": "05-photoelectric",
      "category": "05-atomic",
      "title": "광전 효과",
      "titleEn": "Photoelectric Effect",
      "year": "1905년",
      "scientist": "알베르트 아인슈타인",
      "difficulty": 3,
      "description": "빛의 진동수에 따라 전자가 방출되는 빛의 입자성을 본다.",
      "keywords": [
        "광전효과",
        "광자",
        "일함수",
        "문턱 진동수",
        "빛의 입자성"
      ],
      "status": "planned"
    },
    {
      "id": 29,
      "slug": "06-millikan",
      "category": "05-atomic",
      "title": "밀리컨의 기름방울 실험",
      "titleEn": "Millikan's Oil Drop Experiment",
      "year": "1909년",
      "scientist": "로버트 밀리컨",
      "difficulty": 3,
      "description": "전기장 속 기름방울의 평형으로 기본 전하량을 측정한다.",
      "keywords": [
        "기본전하",
        "기름방울",
        "전하량 e",
        "밀리컨",
        "양자화"
      ],
      "status": "planned"
    },
    {
      "id": 30,
      "slug": "07-rutherford",
      "category": "05-atomic",
      "title": "러더퍼드 산란 실험",
      "titleEn": "Rutherford Scattering",
      "year": "1911년",
      "scientist": "어니스트 러더퍼드",
      "difficulty": 3,
      "description": "알파 입자 산란으로 원자핵의 존재를 발견한다.",
      "keywords": [
        "원자핵",
        "알파 산란",
        "금박 실험",
        "러더퍼드",
        "원자 모형"
      ],
      "status": "planned"
    },
    {
      "id": 31,
      "slug": "08-bohr",
      "category": "05-atomic",
      "title": "보어의 원자 모형",
      "titleEn": "Bohr's Atomic Model",
      "year": "1913년",
      "scientist": "닐스 보어",
      "difficulty": 3,
      "description": "전자의 양자화된 궤도와 스펙트럼선의 관계를 본다.",
      "keywords": [
        "보어 모형",
        "에너지 준위",
        "스펙트럼선",
        "양자 도약",
        "수소 원자"
      ],
      "status": "planned"
    },
    {
      "id": 32,
      "slug": "09-franck-hertz",
      "category": "05-atomic",
      "title": "프랑크-헤르츠 실험",
      "titleEn": "Franck-Hertz Experiment",
      "year": "1914년",
      "scientist": "제임스 프랑크, 구스타프 헤르츠",
      "difficulty": 4,
      "description": "전자 충돌의 에너지 계단으로 원자 준위의 양자화를 증명한다.",
      "keywords": [
        "에너지 양자화",
        "전자 충돌",
        "원자 준위",
        "문턱 에너지",
        "수은"
      ],
      "status": "planned"
    },
    {
      "id": 33,
      "slug": "01-de-broglie",
      "category": "06-quantum",
      "title": "드브로이 물질파",
      "titleEn": "de Broglie Matter Waves",
      "year": "1924년",
      "scientist": "루이 드브로이",
      "difficulty": 3,
      "description": "입자도 파장을 가진다는 물질파 개념을 시각화한다.",
      "keywords": [
        "물질파",
        "드브로이 파장",
        "파동-입자 이중성",
        "운동량",
        "양자"
      ],
      "status": "planned"
    },
    {
      "id": 34,
      "slug": "02-davisson-germer",
      "category": "06-quantum",
      "title": "데이비슨-거머 실험",
      "titleEn": "Davisson-Germer Experiment",
      "year": "1927년",
      "scientist": "클린턴 데이비슨, 레스터 거머",
      "difficulty": 4,
      "description": "전자의 회절무늬로 물질파를 실험으로 확인한다.",
      "keywords": [
        "전자 회절",
        "물질파 검증",
        "결정 격자",
        "브래그 회절",
        "파동성"
      ],
      "status": "planned"
    },
    {
      "id": 35,
      "slug": "03-schrodinger",
      "category": "06-quantum",
      "title": "슈뢰딩거 방정식",
      "titleEn": "Schrödinger Equation",
      "year": "1926년",
      "scientist": "에르빈 슈뢰딩거",
      "difficulty": 5,
      "description": "파동함수의 시간 변화와 확률 분포를 탐구한다.",
      "keywords": [
        "파동함수",
        "슈뢰딩거 방정식",
        "확률 분포",
        "퍼텐셜 우물",
        "양자역학"
      ],
      "status": "planned"
    },
    {
      "id": 36,
      "slug": "04-uncertainty",
      "category": "06-quantum",
      "title": "하이젠베르크 불확정성 원리",
      "titleEn": "Heisenberg Uncertainty Principle",
      "year": "1927년",
      "scientist": "베르너 하이젠베르크",
      "difficulty": 4,
      "description": "위치와 운동량을 동시에 정확히 알 수 없는 한계를 본다.",
      "keywords": [
        "불확정성",
        "위치-운동량",
        "하이젠베르크",
        "파속",
        "양자 한계"
      ],
      "status": "planned"
    },
    {
      "id": 37,
      "slug": "05-stern-gerlach",
      "category": "06-quantum",
      "title": "슈테른-게를라흐 실험",
      "titleEn": "Stern-Gerlach Experiment",
      "year": "1922년",
      "scientist": "오토 슈테른, 발터 게를라흐",
      "difficulty": 4,
      "description": "은 원자 빔이 두 갈래로 갈라지는 스핀 양자화를 본다.",
      "keywords": [
        "스핀",
        "공간 양자화",
        "자기 모멘트",
        "은 원자",
        "측정"
      ],
      "status": "planned"
    },
    {
      "id": 38,
      "slug": "06-quantum-tunneling",
      "category": "06-quantum",
      "title": "양자 터널링",
      "titleEn": "Quantum Tunneling",
      "year": "1928년",
      "scientist": "조지 가모프",
      "difficulty": 4,
      "description": "입자가 고전적으로 넘을 수 없는 장벽을 통과하는 현상을 본다.",
      "keywords": [
        "양자 터널링",
        "퍼텐셜 장벽",
        "투과 확률",
        "파동함수",
        "알파 붕괴"
      ],
      "status": "planned"
    },
    {
      "id": 39,
      "slug": "07-bell-inequality",
      "category": "06-quantum",
      "title": "벨 부등식과 얽힘",
      "titleEn": "Bell's Inequality",
      "year": "1964년",
      "scientist": "존 스튜어트 벨",
      "difficulty": 5,
      "description": "양자 얽힘이 국소적 숨은 변수 이론을 위배함을 보인다.",
      "keywords": [
        "벨 부등식",
        "양자 얽힘",
        "비국소성",
        "숨은 변수",
        "EPR"
      ],
      "status": "planned"
    },
    {
      "id": 40,
      "slug": "01-time-dilation",
      "category": "07-relativity",
      "title": "시간 지연",
      "titleEn": "Time Dilation",
      "year": "1905년",
      "scientist": "알베르트 아인슈타인",
      "difficulty": 3,
      "description": "빠르게 움직이는 시계가 느리게 가는 특수상대론 효과를 본다.",
      "keywords": [
        "시간 지연",
        "특수상대성",
        "빛 시계",
        "로런츠 인자",
        "쌍둥이 역설"
      ],
      "status": "planned"
    },
    {
      "id": 41,
      "slug": "02-length-contraction",
      "category": "07-relativity",
      "title": "길이 수축",
      "titleEn": "Length Contraction",
      "year": "1905년",
      "scientist": "알베르트 아인슈타인",
      "difficulty": 3,
      "description": "운동 방향으로 물체의 길이가 줄어드는 효과를 시각화한다.",
      "keywords": [
        "길이 수축",
        "특수상대성",
        "로런츠 변환",
        "고유 길이",
        "상대속도"
      ],
      "status": "planned"
    },
    {
      "id": 42,
      "slug": "03-spacetime-curvature",
      "category": "07-relativity",
      "title": "시공간 곡률",
      "titleEn": "Spacetime Curvature",
      "year": "1915년",
      "scientist": "알베르트 아인슈타인",
      "difficulty": 4,
      "description": "질량이 시공간을 휘게 해 중력을 만드는 일반상대론을 본다.",
      "keywords": [
        "시공간",
        "곡률",
        "일반상대성",
        "측지선",
        "중력"
      ],
      "status": "planned"
    },
    {
      "id": 43,
      "slug": "04-eddington",
      "category": "07-relativity",
      "title": "에딩턴의 일식 관측",
      "titleEn": "Eddington's Eclipse Expedition",
      "year": "1919년",
      "scientist": "아서 에딩턴",
      "difficulty": 3,
      "description": "일식 때 별빛의 휘어짐을 측정해 일반상대성을 검증한다.",
      "keywords": [
        "빛의 휘어짐",
        "일식",
        "일반상대성 검증",
        "에딩턴",
        "중력"
      ],
      "status": "planned"
    },
    {
      "id": 44,
      "slug": "05-gravitational-lensing",
      "category": "07-relativity",
      "title": "중력 렌즈",
      "titleEn": "Gravitational Lensing",
      "year": "1936년",
      "scientist": "알베르트 아인슈타인",
      "difficulty": 4,
      "description": "거대 질량이 뒤쪽 천체의 빛을 휘어 상을 만드는 현상을 본다.",
      "keywords": [
        "중력 렌즈",
        "아인슈타인 고리",
        "빛의 휘어짐",
        "은하단",
        "천체"
      ],
      "status": "planned"
    },
    {
      "id": 45,
      "slug": "06-hubble",
      "category": "07-relativity",
      "title": "허블의 우주 팽창",
      "titleEn": "Hubble's Expanding Universe",
      "year": "1929년",
      "scientist": "에드윈 허블",
      "difficulty": 3,
      "description": "은하의 적색편이로 우주가 팽창함을 보인다.",
      "keywords": [
        "우주 팽창",
        "적색편이",
        "허블 법칙",
        "후퇴 속도",
        "빅뱅"
      ],
      "status": "planned"
    },
    {
      "id": 46,
      "slug": "07-cmb",
      "category": "07-relativity",
      "title": "우주배경복사 발견",
      "titleEn": "Discovery of the CMB",
      "year": "1965년",
      "scientist": "펜지어스, 윌슨",
      "difficulty": 3,
      "description": "하늘 전역의 마이크로파 잡음에서 빅뱅의 잔광을 발견한다.",
      "keywords": [
        "우주배경복사",
        "CMB",
        "빅뱅",
        "마이크로파",
        "펜지어스-윌슨"
      ],
      "status": "planned"
    },
    {
      "id": 47,
      "slug": "01-laser",
      "category": "08-modern",
      "title": "레이저의 원리",
      "titleEn": "How a Laser Works",
      "year": "1960년",
      "scientist": "시어도어 메이먼",
      "difficulty": 3,
      "description": "유도 방출과 광 증폭으로 결맞는 빛이 만들어지는 과정을 본다.",
      "keywords": [
        "레이저",
        "유도 방출",
        "광 증폭",
        "결맞음",
        "반전 분포"
      ],
      "status": "planned"
    },
    {
      "id": 48,
      "slug": "02-superconductivity",
      "category": "08-modern",
      "title": "초전도 현상",
      "titleEn": "Superconductivity",
      "year": "1911년",
      "scientist": "하이케 카메를링 오너스",
      "difficulty": 4,
      "description": "임계 온도 이하에서 저항이 0이 되고 자석이 뜨는 현상을 본다.",
      "keywords": [
        "초전도",
        "마이스너 효과",
        "임계온도",
        "저항 제로",
        "자기부상"
      ],
      "status": "planned"
    },
    {
      "id": 49,
      "slug": "03-nuclear-fission",
      "category": "08-modern",
      "title": "핵분열 연쇄반응",
      "titleEn": "Nuclear Fission",
      "year": "1938년",
      "scientist": "한, 슈트라스만, 마이트너",
      "difficulty": 3,
      "description": "중성자가 무거운 핵을 쪼개 연쇄반응이 퍼지는 과정을 본다.",
      "keywords": [
        "핵분열",
        "연쇄반응",
        "임계질량",
        "중성자",
        "핵에너지"
      ],
      "status": "planned"
    },
    {
      "id": 50,
      "slug": "04-gravitational-waves",
      "category": "08-modern",
      "title": "중력파 검출 (LIGO)",
      "titleEn": "Gravitational Waves (LIGO)",
      "year": "2015년",
      "scientist": "LIGO 협력단",
      "difficulty": 4,
      "description": "블랙홀 충돌이 만든 시공간의 잔물결을 간섭계로 검출한다.",
      "keywords": [
        "중력파",
        "LIGO",
        "간섭계",
        "블랙홀 병합",
        "시공간"
      ],
      "status": "planned"
    },
    {
      "id": 51,
      "slug": "05-black-hole-eht",
      "category": "08-modern",
      "title": "블랙홀 영상화 (EHT)",
      "titleEn": "Black Hole Imaging (EHT)",
      "year": "2019년",
      "scientist": "사건의 지평선 망원경 협력단",
      "difficulty": 3,
      "description": "전 지구 전파망원경을 묶어 블랙홀의 그림자를 촬영한다.",
      "keywords": [
        "블랙홀",
        "사건의 지평선",
        "EHT",
        "전파간섭계",
        "M87"
      ],
      "status": "planned"
    },
    {
      "id": 52,
      "slug": "06-higgs-boson",
      "category": "08-modern",
      "title": "힉스 보손 발견",
      "titleEn": "Discovery of the Higgs Boson",
      "year": "2012년",
      "scientist": "CERN (힉스 메커니즘)",
      "difficulty": 5,
      "description": "입자에 질량을 주는 힉스 장과 그 입자의 검출을 본다.",
      "keywords": [
        "힉스 보손",
        "힉스 장",
        "질량의 기원",
        "LHC",
        "표준모형"
      ],
      "status": "planned"
    },
    {
      "id": 53,
      "slug": "07-qubit",
      "category": "08-modern",
      "title": "양자컴퓨팅 큐비트",
      "titleEn": "Quantum Computing Qubit",
      "year": "2019년",
      "scientist": "양자컴퓨팅 연구진",
      "difficulty": 5,
      "description": "중첩과 얽힘을 이용하는 큐비트의 동작 원리를 본다.",
      "keywords": [
        "큐비트",
        "중첩",
        "양자 게이트",
        "블로흐 구",
        "양자컴퓨팅"
      ],
      "status": "planned"
    }
  ]
}
```

---

## 6. 데이터 무결성 규칙

`experiments.json`을 편집할 때 다음 불변식(invariant)을 반드시 지켜야 한다. 순수 정적 사이트이므로 런타임 검증이 없다 — 규약 준수가 곧 안정성이다.

- `categories` 배열 길이는 정확히 8이며, `id` 값은 8개 카테고리 폴더명과 일치한다.
- `experiments` 배열 길이는 정확히 53이며, `id`는 1부터 53까지 빠짐없이 유일하다.
- 모든 `experiments[].category` 값은 `categories[].id` 중 하나를 가리켜야 한다(외래 키 무결성).
- `slug`는 카테고리 내에서 유일하며 `NN-name` 형식을 따른다. `src/experiments/{category}/{slug}.html` 파일이 실제로 존재해야 해당 실험을 `status: "ready"`로 전환할 수 있다.
- `difficulty`는 1~5의 정수만 허용한다.
- `status`는 `"ready"`, `"planned"`, `"in-progress"` 외의 값을 가질 수 없다.
- `color`는 `#RRGGBB` 형식의 hex 문자열이다.
- 한글·이모지가 깨지지 않도록 파일은 UTF-8로 저장한다.
