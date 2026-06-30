# 🧪 Git Science Park

**An interactive learning platform for the landmark experiments of science — learn by doing, not by reading.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2E4A62)](https://denny-hwang.github.io/git-science-park/)
[![Experiments](https://img.shields.io/badge/Experiments-65-C53030)](https://denny-hwang.github.io/git-science-park/)
[![Eras](https://img.shields.io/badge/Eras-9-6B46C1)](#-the-9-eras)
[![Languages](https://img.shields.io/badge/Languages-10-0E7490)](#-internationalization-i18n)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero-2B6CB0)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-234E52)](LICENSE)

> From Eratosthenes measuring the circumference of the Earth to imaging a black hole and computing with qubits — **65 interactive labs** where you *manipulate* science history instead of just *reading* it.

🔗 **Live demo:** <https://denny-hwang.github.io/git-science-park/>

---

## 📖 About

**Git Science Park** is a static web platform for learning **65 pivotal experiments** in the history of physics, by manipulating each one directly in the browser.

### What

Every experiment is not just text and figures but an **interactive simulation** where you change variables and observe the outcome. Each lab guides the learner through an active loop:

```
Manipulate        →        Observe        →        Interpret
change variables          watch results            understand the
& design the run          & gather data            principle yourself
```

### Why

Science is not a body of conclusions to memorize — it is the process of **questioning, experimenting, and interpreting**. By re-creating and varying the great moments of discovery, Git Science Park helps learners internalize *why* those conclusions were reached.

### Highlights

| Feature | Description |
| --- | --- |
| 🧫 **65 experiments** | From the birth of measurement to the extremes of modern physics and quantum computing |
| 🕰️ **9 eras** | Ancient → Scientific Revolution → Precision Era → Energy & Field → Atomic → Quantum → Relativity → Modern → Quantum Computing |
| 🗂️ **3-tab layout** | 🎮 Interactive · 📚 Principles · 📜 History |
| 🌐 **10 languages** | English (default), Korean, Chinese, Japanese, Spanish, Hindi, Russian, Hebrew, Portuguese, Arabic — with RTL support |
| 🎓 **Classroom mode** | Focus/present mode, printable worksheet, lesson playlist, teacher guide |
| ♿ **Accessible** | WCAG 2 AA verified (axe-core), color-blind palette, `prefers-reduced-motion` |
| 📦 **Zero dependencies** | No libraries, frameworks, or build tools — pure HTML/CSS/JS |
| 🔌 **Offline-capable** | Each experiment is a self-contained HTML file |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |

---

## 🏛️ The 9 eras

| Icon | Era | Experiments | Tagline |
| :---: | --- | :---: | --- |
| 🏛️ | Ancient | 4 | Birth of measurement and geometry |
| 🔭 | Scientific Revolution | 7 | Experiment meets mathematics |
| ⚗️ | Precision Era (18th c.) | 5 | The age of precise measurement |
| 🔥 | Energy & Field (19th c.) | 7 | Energy and fields |
| ⚛️ | Atomic Age | 9 | The ultimate structure of matter |
| 🌊 | Quantum Mechanics | 12 | The making of quantum theory |
| 🌌 | Relativity & Cosmology | 7 | Relativity and the cosmos |
| 🔬 | Modern Physics | 7 | Exploring the extremes |
| 🖥️ | Quantum Information & Computing | 7 | Computing with qubits |
| | **Total** | **65** | |

A few examples: 🌍 Eratosthenes, 🍎 Newton's gravitation, 🌈 Newton's prism, 🧲 Faraday induction, ⚛️ Rutherford scattering, 🐱 Schrödinger equation, ☁️ hydrogen orbitals, 🧭 Bloch sphere & qubit gates, 🔎 Grover's search, 🔁 quantum teleportation, 🔐 BB84 key distribution, 🕳️ black-hole imaging (EHT), 🧩 Higgs boson.

---

## ✨ Key features

### 🌐 Internationalization (i18n)
The entire UI is translated into **10 languages** with a top-right dropdown; the choice persists in `localStorage`. Arabic and Hebrew switch the document to **RTL** automatically. A dependency-free engine (`i18n.js`) drives `data-i18n` attributes from per-locale JSON dictionaries. *(Note: the UI chrome is translated; each experiment's scientific body content stays in its original language.)*

### 🎓 Classroom mode
A **🎓 Classroom** button on every page opens four teacher tools:
- **Focus / Present mode** — hide chrome and go fullscreen for projection
- **Printable worksheet** — Predict · Observe · Interpret · Notes + name/date
- **Lesson playlist** — collect experiments, reorder them, and run them in sequence
- **Teacher guide** — per-experiment era · scientist · difficulty · key questions

### ♿ Accessibility & performance
- **WCAG 2 AA** verified across the hub and all experiment pages with **axe-core** (0 serious/critical violations)
- **Color-blind palette** toggle (Okabe-Ito), keeping non-color cues (icons, text, stars)
- **`prefers-reduced-motion`** respected site-wide
- Canvas `requestAnimationFrame` loops **pause when the tab is hidden** (low-end-device friendly)

### 📚 "Learn more" links
Each experiment links out to curated **Wikipedia (EN/KO)**, a **YouTube** search, and — where relevant — an authoritative source (CERN, LIGO, EHT, NASA, Nobel Prize).

---

## 🛠️ Tech stack

A pure **static website** that runs directly in the browser with no build step.

- **HTML5** — semantic markup
- **CSS3** — responsive layout, dark hub / light experiment themes
- **Vanilla JavaScript (ES6+)** — no frameworks
- **Canvas API** — 2D physics & quantum simulations
- **SVG** — precise diagrams

> **Zero dependencies** — no npm install, bundler, or transpiler for the site itself. Each experiment is a **self-contained single HTML file** that also works offline. The only added shared assets are dependency-free: `i18n.js`, `a11y.js`, `classroom.js`, and `classroom.css`.

**Cross-browser:** automatically verified on **Chromium · Firefox · WebKit** in CI.

---

## 🚀 Getting started

### 1. View the live demo

No setup required:

👉 <https://denny-hwang.github.io/git-science-park/>

### 2. Run locally

Clone the repo and serve the `src/` folder with any static server. (Files are self-contained, but a static server is recommended so the hub's `fetch`-based metadata loads correctly.)

```bash
git clone https://github.com/Denny-Hwang/git-science-park.git
cd git-science-park
```

Pick whichever you prefer:

```bash
# Option A — Python 3 built-in server
python3 -m http.server 8000 --directory src

# Option B — Node.js (serve)
npx serve src

# Option C — VS Code Live Server extension
#   open src/index.html and click "Go Live"
```

Then open:

```
http://localhost:8000
```

---

## 🧪 Developing & testing

The site ships **zero runtime dependencies**; the only dev tooling is for automated QA (Playwright) and accessibility auditing (axe-core), declared in `package.json` and run in CI — never deployed.

```bash
npm install
npx playwright install --with-deps chromium firefox webkit

# serve the site, then:
python3 -m http.server 8000 --directory src &

npm test          # cross-browser QA: tab behavior, 0 console errors, hub checks (Chromium/Firefox/WebKit)
npm run test:a11y # accessibility audit: WCAG 2 A/AA via axe-core
```

Both run automatically on every push via `.github/workflows/qa.yml`, alongside GitHub Pages deployment (`.github/workflows/deploy.yml`).

---

## 📂 Project structure

```
git-science-park/
├── README.md                    # this document
├── CONTRIBUTING.md              # contribution guide
├── CHANGELOG.md                 # change history
├── LICENSE                      # MIT
├── package.json                 # dev/test tooling only (Playwright, axe-core)
├── tests/
│   ├── qa.mjs                   # cross-browser page QA
│   └── a11y.mjs                 # WCAG AA audit
├── docs/                        # project documentation (Korean)
│   ├── 01-planning/             # PRD, roadmap, user stories
│   ├── 02-design/               # architecture, data model, UI
│   ├── 03-development/          # setup, coding standards, Git workflow
│   └── 04-experiments/          # per-experiment notes
├── src/                         # deploy root (the static site)
│   ├── index.html               # hub page
│   ├── data/
│   │   └── experiments.json     # metadata for all 65 experiments
│   ├── assets/
│   │   ├── css/
│   │   │   ├── exp.css           # shared experiment styles (opt-in)
│   │   │   └── classroom.css     # top bar, language switcher, classroom mode
│   │   ├── js/
│   │   │   ├── i18n.js           # 10-language translation engine
│   │   │   ├── a11y.js           # color-blind palette + reduced-motion helpers
│   │   │   ├── classroom.js      # classroom mode (4 tools)
│   │   │   └── exp.js            # shared experiment helpers (opt-in)
│   │   └── i18n/                 # per-locale dictionaries (en, ko, zh, ja, es, hi, ru, he, pt, ar)
│   └── experiments/             # experiment pages by era
│       ├── 01-ancient/
│       ├── 02-scientific-revolution/
│       ├── 03-precision-era/
│       ├── 04-energy-field/
│       ├── 05-atomic/
│       ├── 06-quantum/
│       ├── 07-relativity/
│       ├── 08-modern/
│       └── 09-quantum-computing/
└── .github/
    └── workflows/
        ├── deploy.yml           # GitHub Pages auto-deploy (uploads ./src)
        └── qa.yml               # cross-browser QA + accessibility gate
```

Experiment page paths follow `src/experiments/{category}/{slug}.html` (e.g. `src/experiments/01-ancient/01-eratosthenes.html`; the hub links to `./experiments/01-ancient/01-eratosthenes.html`).

### Documentation

- **Planning** — [PRD](docs/01-planning/PRD.md) · [Roadmap](docs/01-planning/ROADMAP.md) · [User stories](docs/01-planning/USER-STORIES.md)
- **Design** — [Architecture](docs/02-design/ARCHITECTURE.md) · [Data model](docs/02-design/DATA-MODEL.md) · [Experiment template](docs/02-design/EXPERIMENT-TEMPLATE.md) · [UI design](docs/02-design/UI-DESIGN.md)
- **Development** — [Setup](docs/03-development/SETUP.md) · [Coding standards](docs/03-development/CODING-STANDARDS.md) · [Git workflow](docs/03-development/GIT-WORKFLOW.md)

*(The documents above are currently written in Korean.)*

---

## 🤝 Contributing

New experiments, simulation improvements, documentation, and bug reports are all welcome. Experiment pages follow the [experiment template](docs/02-design/EXPERIMENT-TEMPLATE.md) and register their metadata in `src/data/experiments.json`.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for branch strategy, commit conventions, and the PR process.

---

## 🗺️ Roadmap

| Milestone | Status | Highlights |
| :---: | :---: | --- |
| **v1.0** | ✅ Done | 53 experiments · hub · 3-tab layout · responsive · GitHub Pages |
| **v1.1** | ✅ Done | Physics-correctness review · shared shell · cross-links · hub UX · QA CI |
| **v2.0** | ✅ Done | 10-language i18n · classroom mode · WCAG AA + color-blind · reduced-motion/perf · cross-browser CI · "Learn more" links |
| **Quantum expansion** | ✅ Done | New **Quantum Computing** era + more quantum mechanics → **65 experiments** |

**Next candidates:** translating experiment body content · quiz/assessment mode · worksheet PDF export · further domains (condensed matter, particle physics, beyond physics).

See **[ROADMAP.md](docs/01-planning/ROADMAP.md)** for details.

---

## 📄 License

Released under the **MIT License**. See [LICENSE](LICENSE) for details.

```
Copyright (c) 2026 Sungjoo (Dennis) Hwang
```
