# Pet-Bewerbung (Pet CV) Generator

Web application for creating an official PDF dossier for a pet as part of a Swiss apartment rental application.

**Live:** https://pet-bewerbung.ch

---

## Idea / Mission

In Switzerland, pets can become a reason for landlords to reject otherwise good tenants. `Pet-Bewerbung` helps you create a clear, professional PDF dossier for your pet in minutes, so you can build trust early and avoid needless back-and-forth.

Principles:

- Privacy by design (everything runs in your browser)
- Structured, landlord-friendly document layout
- Free access to all templates and features

## What it does

- Multi-step form (wizard) to collect owner + pet details
- Local text generation for the “character/behavior” section (runs in the browser; no server calls)
  - 3 rotating text variants per language (DE/EN/FR/IT/RM), now managed in `translations/*`
- Generates:
  - HTML preview (A4 layout)
  - PDF dossier (client-side, downloaded as a file)
  - ZIP download for all free templates (desktop-only to reduce OOM risk)
- QR code embedded in the PDF (vCard 3.0)
- Photo upload & compression before storage/generation (JPG/PNG/WEBP/HEIC/HEIF, max 10 MB, with HEIC fallback hint)
- Optional privacy-friendly analytics (Umami) for key product events

---

## Privacy (local-first)

There is **no backend** and no data transfer to third parties.

- Form draft (except photo) is stored **in the browser**
- Photo is stored **in IndexedDB**
- PDF rendering happens fully **in the browser**

Analytics note:

- Umami can be enabled optionally for anonymous usage metrics
- No form field values or sensitive personal data are sent

---

## Tech stack

| Component | Technology |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| State | Zustand |
| PDF rendering | `@react-pdf/renderer` |
| ZIP export | JSZip |
| QR code | `qrcode` |
| Photo | `react-image-crop` + compression |
| Storage | `idb-keyval` (IndexedDB) + `sessionStorage` (draft) |

---

## Local development

1. Install dependencies
   ```bash
   npm ci
   ```
2. Start dev server (Vite is configured for port `3000`)
   ```bash
   npm run dev
   ```
3. Open:
   - http://localhost:3000

Build & preview:

```bash
npm run build
npm run preview
```

E2E smoke tests (Playwright):

```bash
npm run e2e
```

---

## Architecture (high level)

Main entry + composition:

- `src/App.tsx` - wraps the app in `AppProviders` and renders `AppContent`
- `src/components/AppContent.tsx` - business logic:
  - generate “character/behavior” text locally
  - download single PDF via `exportPdfService`; ZIP uses dynamic `exportZipService` (JSZip only after click)
- `src/components/AppContainer.tsx` - UI orchestration:
  - wizard step rendering
  - theme + step progress
  - modals (FAQ/legal/preview/cookie consent)

Routing helpers:

- `src/components/StepRenderer.tsx` - switches between `HeroRoute` and `WizardRoute`
- `src/routes/HeroRoute.tsx`, `src/routes/WizardRoute.tsx`, `src/routes/ThankYouRoute.tsx`

Modals:

- `src/components/ModalsLayer.tsx`

Steps:

- `src/components/steps/Step1Details.tsx` ... `Step6ThankYou.tsx`

HTML + templates:

- `src/components/SwissDocument.tsx` - browser preview (A4)
- `src/components/templates/*Template.tsx` - Classic/Modern/Compact HTML templates
- `src/components/document/*` - HTML sections used by templates

PDF:

- `src/components/SwissDocumentPdf.tsx` - selects a PDF template by `templateType`
- `src/components/pdf/`
  - `PdfBase.ts` - shared PDF styles/colors/layout constants
  - `PdfDocument.tsx` - shared “one document” renderer for all template variants
  - `pdfTemplateRegistry.ts` - maps `templateType` -> thin wrapper components
  - `templates/*Pdf.tsx` - wrappers (`ClassicPdf`, `ModernPdf`, `CompactPdf`)
- `src/services/pdfService.tsx` - builds PDF translations and renders `toBlob()`
- `src/services/exportPdfService.ts` - single PDF download
- `src/services/exportZipService.ts` - ZIP (lazy chunk; injects `generatePdfBlob` / `preparePdfData` from caller)
- `src/services/exportService.ts` - re-exports both (compat)

**Build / perf**

- `vite-plugin-css-injected-by-js` — CSS embedded in JS in production (no render-blocking `.css` link; possible brief FOUC on very slow devices).
- JSZip is **not** in the main entry chunk; ZIP loads `jszip` only when the user starts a ZIP download.
- `@react-pdf/renderer` stays in its own chunk; loads on first `generatePdfBlob()` (PDF download / ZIP).

---

## i18n (translations)

`src/hooks/useTranslation.ts` uses Vite lazy loading:

- `import.meta.glob('../translations/*.ts')`
- loads only the currently selected language on demand

Translations live in:

- `src/translations/de.ts`, `en.ts`, `fr.ts`, `it.ts`, `rm.ts`

---

## State & storage

Zustand store:

- `src/stores/formStore.ts`
  - debounced autosave (500ms)
  - atomic update helpers (`updateData`, `updateMultipleData`)

Storage adapters (local-first):

- `src/utils/simpleStorage.ts`
  - draft text: `sessionStorage`
  - photo: IndexedDB via `idb-keyval`

---

## PDF generation notes

- Photo conversion to JPEG happens before generating PDF (for better react-pdf compatibility)
- ZIP download is disabled on mobile devices (OOM risk); single-template PDF remains available
- `@react-pdf/renderer` is split into a dedicated chunk to reduce first-render bundle cost

---

## Environment variables

Create `.env` from `.env.example` when using Docker/tunnel and optional analytics:

- Required for VPS tunnel:
  - `CLOUDFLARE_TUNNEL_TOKEN`
- Optional (Umami analytics):
  - `VITE_UMAMI_WEBSITE_ID`
  - `VITE_UMAMI_HOST` (default: `https://analytics.umami.is`)
  - `VITE_UMAMI_DOMAINS` (default: current hostname)

Tracked custom events:

- `Template_Changed` (template switch in step 5)
- `PDF_Downloaded` (single PDF export)
- `ZIP_Downloaded` (all templates ZIP export)

---

## Performance (Lighthouse / Core Web Vitals)

Implemented in code and `nginx.conf`:

- Long-lived cache for `/fonts/` and static assets (repeat visits)
- Umami loads after `requestIdleCallback` (no analytics `preconnect` in HTML — avoids Lighthouse “unused preconnect”; `preconnect` to script origin is injected in JS right before the script loads)
- CSP `connect-src` allows `https://api-gateway.umami.dev` (Umami events)
- Theme transitions avoid animating `color` on large subtrees (better compositing; fewer “non-composited animation” warnings)
- Header logo `<img>` uses explicit `width`/`height`, `decoding="async"`, `fetchPriority="high"` (LCP hint)

Further improvements (optional):

- Brand assets in `public/`: `logo.webp` (PDF/templates), `logo-header.webp` (header/LCP, small), `apple-touch-icon.webp`, `android-chrome-*.webp` (`PUBLIC_LOGO_PATH` / `PUBLIC_LOGO_HEADER_PATH` in `src/constants.ts`)
- UI icons: SVG in `public/icons/material/` (see `docs/material-icons-used.md`, component `MaterialIcon`)

---

## SEO / Sitemap (Google Search Console)

- **Correct sitemap URL:** `https://pet-bewerbung.ch/sitemap.xml`  
  Vite copies `public/sitemap.xml` to the **site root** — there is **no** `/public/` prefix in the deployed URL.
- **Do not** submit `https://pet-bewerbung.ch/public/sitemap.xml` in GSC: that path does not exist as a file, so nginx falls through to the SPA `index.html` → Google reports “Sitemap is HTML” and errors.
- After deploy, re-submit the sitemap in Search Console using the **root** URL above. `robots.txt` already references it.

---

## TypeScript migration status

The project source under `src/` is TypeScript-only:

- no `.js` / `.jsx` files remain in `src/`
- `tsconfig.json` is `strict: true`

