# Git Science Park v2.0.0 — Internationalization · Classroom Mode · Accessibility

> Interactive Science History Lab — learn 53 landmark experiments by **manipulating, observing, and interpreting**, in a Zero-Dependency static web app.
> This release makes it ready for **classrooms worldwide** with multi-language UI, teacher tools, and accessibility.

**Release date:** 2026-06-30 · **Previous:** v1.1.0 · **Changes:** 72 files, +4,605 / −910

---

## ✨ New Features

### 🌐 Internationalization (10 languages)
The entire UI/interface is translated into 10 languages. (Each experiment's scientific content stays in its original language.)

- **Languages:** English (default) · Korean · Chinese · Japanese · Spanish · Hindi · Russian · Hebrew · Portuguese · Arabic
- **Top-right dropdown** for instant switching; the choice is saved in the browser (`localStorage`)
- **Automatic RTL (right-to-left)** — `dir="rtl"` for Arabic and Hebrew
- Consistent translation across the hub and all 53 experiment pages — tabs, navigation, related experiments, and classroom mode
- Pure dependency-free engine (`i18n.js`) + per-locale JSON dictionaries (79 keys each)

### 🎓 Classroom Mode (4 teacher tools)
Available from the **🎓 Classroom** button in the top-right of every page.

- **Focus / Present mode** — hides surrounding UI to focus on the simulation (+ fullscreen)
- **Printable worksheet** — Predict · Observe · Interpret · Notes, plus name/date, ready to print
- **Lesson course / playlist** — collect experiments, order them, and run them in sequence with prev/next via "Start lesson"
- **Teacher guide panel** — per-experiment era · scientist · difficulty · key questions for quick reference (a full 53-row table on the hub)

---

## ♿ Accessibility · Performance · Quality

### Accessibility audit (WCAG 2 A/AA)
- Hub + all 53 experiment pages **audited with axe-core** → **0** serious/critical contrast violations
- Corrected muted body text, white text on active filter chips, success/error semantic colors, and per-page badges/legends to meet AA
- **Color-blind palette option** — ◐ toggle in the top-right, color-blind-safe Okabe-Ito palette (keeps non-color cues such as icons, text, and star ratings alongside color)

### Motion · performance
- **`prefers-reduced-motion` applied everywhere** — now covers the experiment pages too (previously none)
- **Low-end device friendly** — pauses Canvas `requestAnimationFrame` loops when the tab isn't visible, and resumes on return

### Cross-browser verification
- Automated QA expanded to cycle through **Chromium · Firefox · WebKit**
- Added an **accessibility gate** to CI — every push automatically verifies tab behavior, zero console errors, and WCAG AA

---

## 🧱 Technical notes
- **Zero runtime dependencies** — the site is still pure HTML5 + CSS3 + vanilla JS. The added `i18n.js` · `a11y.js` · `classroom.js` · `classroom.css` use no external libraries
- Playwright and axe-core are **dev/CI only** and are not included in the deployed bundle (`src/`)
- GitHub Pages auto-deploy unchanged (uploads `./src` on push to `main`)

## ⚠️ Known limitations
- Internationalization applies to the **UI chrome**. Each experiment's body content (descriptions and simulation labels) stays in its original language (mostly Korean).
- In RTL languages, the experiment body itself is still shown in its original direction.

## 🔭 Next candidates
- Translating experiment body content · quiz/assessment mode · worksheet PDF export · custom palettes

---

**Full changelog:** `v1.1.0...v2.0.0` ·
Commits: `5a5ce80` (v2.0-A i18n + classroom), `351a856` (v2.0-B accessibility + performance + cross-browser)
