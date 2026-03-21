# Product improvements roadmap

## Done (implemented in repo)

| Area | What |
|------|------|
| **Draft persistence** | Form text draft is stored in **localStorage** (survives tab close). One-time migration from legacy **sessionStorage**. Photo remains in **IndexedDB** (`idb-keyval`). |
| **PWA** | **vite-plugin-pwa** — precache of built assets, `registerSW({ immediate: true })` in `index.tsx`, manifest aligned with icons. Dev server: PWA disabled (`devOptions.enabled: false`). |
| **Fonts** | **WOFF2** generated from TTF via `npm run fonts:woff2` (fontmin). `@font-face` prefers WOFF2, TTF fallback. Preload in `index.html` uses WOFF2. |
| **a11y (baseline)** | `<main id="main-content" aria-label={ui.mainLandmark}>`, toast region with **`aria-live`** / **`role="alert"`** for errors, dismiss control. |
| **WCAG contrast + CLS** | `text-secondary` **`#5a5a5a`** (not `#6a6a6a`) so body text on pastel cards (e.g. **trust-green** `#c8e6c9`) meets **AA 4.5:1**; `text-main` `#4a4a4a` already passes on those surfaces. **`font-display: swap`** on all `@font-face` in `GlobalStyles.tsx`; **`index.html`** preloads Quicksand + **Amatic SC 700** WOFF2 to limit layout shift on hero/display text. |

## Backlog (not automated here)

| Area | Suggestion |
|------|------------|
| **Cantons (26)** | Extend `CANTON_PET_RULES` + official links (AMICUS, municipal dog tax) — content/legal review. |
| **PDF visual regression** | Playwright screenshot or PNG snapshot tests for PDF output when `@react-pdf/renderer` upgrades. |
| **Font subsetting** | Optional `Fontmin.glyph({ text: '...' })` in `scripts/convert-fonts-to-woff2.mjs` after validating all glyphs for DE/EN/FR/IT/RM. |
