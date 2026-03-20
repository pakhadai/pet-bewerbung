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
- Generates:
  - HTML preview (A4 layout)
  - PDF dossier (client-side, downloaded as a file)
  - ZIP download for all free templates (desktop-only to reduce OOM risk)
- QR code embedded in the PDF (vCard 3.0)
- Photo upload & compression before storage/generation
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

---

## Architecture (high level)

Main entry + composition:

- `src/App.tsx` - wraps the app in `AppProviders` and renders `AppContent`
- `src/components/AppContent.tsx` - business logic:
  - generate “character/behavior” text locally
  - download single PDF or ZIP of all templates via `exportService`
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
- `src/services/exportService.ts` - download logic (single PDF / ZIP)

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

## TypeScript migration status

The project source under `src/` is TypeScript-only:

- no `.js` / `.jsx` files remain in `src/`
- `tsconfig.json` is `strict: true`

