# Pet-Bewerbung — Pet CV Generator

Web-application for creating an official PDF dossier for a pet as part of a Swiss apartment rental application.

**Live:** https://pet-bewerbung.ch

---

## Why this exists

In Switzerland, landlords frequently reject tenants with pets. Pet-Bewerbung lets you create a structured,
professional PDF document in 5 minutes that builds landlord trust. The document includes:

- Owner data and contacts
- Pet data (breed, age, weight, gender, chip ID)
- Insurance and veterinary information
- Character and behaviour description (template-based, generated locally)
- Pet photo
- QR code with owner vCard contact
- References from previous landlords

**Privacy by design:** We deliberately do not collect or store personal data. That is why all processing happens in the user's browser — no servers, no databases, no transfer of information to third parties. Your data never leaves your device.

**Completely free:** The service is 100% free. All templates and features are available without payment or registration.

---

## Tech stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, Vite 4, TypeScript, Tailwind CSS |
| PDF rendering | @react-pdf/renderer |
| ZIP export | JSZip |
| Image handling | react-image-crop, vite-plugin-vsharp |
| QR code | qrcode |
| Icons | Lucide React |
| Deploy | Docker, Nginx, Cloudflare Tunnel |

**Local-First:** No backend, no database, no AI API. All processing happens in the browser.

---

## Frontend structure

```
src/
|-- App.tsx                       # Entry: AppProviders + AppContent
|-- components/
|   |-- AppProviders.tsx          # ErrorBoundary wrapper
|   |-- AppContent.tsx            # Business logic:
|   |                             #   generateText() -> template-based text (local)
|   |                             #   handleDownloadPDF() -> single template PDF
|   |                             #   handleDownloadAllTemplates() -> ZIP of all 3
|   |-- AppContainer.tsx          # UI orchestration: steps, theme, modals
|   |-- Header.tsx                # Logo, language selector, theme toggle
|   |-- Footer.tsx                # Legal links, FAQ link
|   |-- Hero.tsx                  # Landing page (step 0)
|   |-- SwissDocument.jsx         # HTML document preview (browser, A4)
|   |-- SwissDocumentPdf.jsx      # PDF renderer (@react-pdf/renderer)
|   |-- StepProgress.jsx          # Progress bar for steps 1-6
|   |-- FloatingNavigation.jsx    # Sticky Prev/Next buttons
|   |-- CookieBanner.jsx          # Cookie consent
|   |-- FaqModal.jsx              # FAQ modal window
|   |-- LegalPages.jsx            # Privacy Policy / Impressum pages
|   |-- ImageCropper.jsx          # Photo crop tool (react-image-crop)
|   |-- ErrorBoundary.tsx         # React error boundary
|   |-- steps/
|   |   |-- Step1Details.jsx      # Step 1: Owner + Pet basics
|   |   |-- Step2HealthInsurance.jsx  # Step 2: Health, insurance, references
|   |   |-- Step3Description.jsx  # Step 3: Template-based text + manual edit
|   |   |-- Step4Photo.jsx        # Step 4: Photo upload
|   |   |-- Step5TemplateSelect.jsx   # Step 5: Template selection
|   |   |-- Step5Preview.jsx      # Step 6: Preview + download
|   |   |-- Step6ThankYou.jsx     # Step 7: Success screen
|   |-- document/                 # HTML document sections (lazy Suspense)
|   |-- templates/                 # Classic, Modern, Compact templates
|   `-- pdf/                      # PDF template components
|-- context/
|   |-- WizardContext.tsx         # Shared wizard state
|   `-- WizardProviders.tsx       # Translation, FormData, Navigation, Theme, Toast
|-- hooks/
|   |-- useFormData.ts            # Form state + persist (visibilitychange, beforeunload)
|   |-- useWizardNavigation.ts    # step, animDir, goToStep, nextStep, prevStep
|   |-- useTranslation.ts        # lang, t, setLang (auto-detect from browser)
|   |-- useTheme.ts              # darkMode, toggleTheme
|   |-- useToast.ts              # showToast(message, type) notifications
|   |-- useTemplateSelection.ts  # Selected template ID + preview modal state
|   |-- useFormValidation.ts     # Field validation rules per step
|   |-- useFormWizard.ts         # Master hook: combines all sub-hooks
|   `-- useScrollVisibility.ts   # Element visibility on scroll
|-- translations/
|   |-- de.js, en.js, fr.js, it.js, rm.js
|   `-- index.js                 # TRANSLATIONS map export
|-- types/
|   |-- form.ts, template.ts, storage.ts
|   `-- index.ts                 # Central re-export
|-- services/
|   |-- pdfService.tsx           # buildPdfTranslations, PDF generation
|   |-- exportService.ts         # downloadPdf, downloadAllTemplatesAsZip
|   `-- index.ts
|-- utils/
|   |-- imageCompression.js       # Compress to 800x800, JPEG 0.8, max 500KB
|   |-- qrCode.js                # QR code: vCard 3.0 builder + PNG data URL
|   |-- swissValidation.js       # Phone (+41), PLZ (1000-9999), email, cantons
|   |-- documentHelpers.jsx      # HTML document helper functions
|   |-- pdfHelpers.ts            # PDF utility functions
|   |-- sanitization.ts          # Frontend input sanitization
|   `-- storage/                 # StorageManager, LocalStorage, SessionStorage, IndexedDB
|-- constants.js                 # INITIAL_DATA, TEMPLATE_OPTIONS, MAX_DESCRIPTION_LENGTH
`-- config.js                    # IMAGE_COMPRESSION settings
```

---

## Wizard steps

Step 0 = HeroRoute, Steps 1-6 = WizardRoute, Step 7 = ThankYouRoute.

| Step | Component | Content |
|------|-----------|---------|
| 0 | Hero.tsx | Landing: problem section, solution section, CTA button |
| 1 | Step1Details.jsx | Owner: name (required), email, phone, address. Pet: type (dog/cat/other), name, breed, age, weight, gender |
| 2 | Step2HealthInsurance.jsx | Vet, insurance, chip ID; neutered/vaccinated/registered; noise level; alone time; behaviour; previous landlord; emergency contacts |
| 3 | Step3Description.jsx | Template-based text generation (local) + manual textarea. Max 470 chars. "100% Privat" badge. |
| 4 | Step4Photo.jsx | Photo upload + crop. Compressed to 800x800, JPEG 0.8, max 500KB. Stored in IndexedDB. |
| 5 | Step5TemplateSelect.jsx | Template selection: Classic / Modern / Compact. Preview in modal. |
| 6 | Step5Preview.jsx | HTML preview. Download PDF (selected template). Download All ZIP (all 3 templates). |
| 7 | Step6ThankYou.jsx | Success screen + Download PDF + Create Another |

---

## PDF templates

All 3 templates are free.

| ID | Name | Style |
|----|------|-------|
| classic | Classic | Official style, purple header, formal layout |
| modern | Modern | Minimalist modern design |
| compact | Compact | Dense one-page layout |

Each template has:
- **HTML** (SwissDocument.jsx): browser preview, A4 size
- **PDF** (SwissDocumentPdf.jsx): @react-pdf/renderer, downloadable

PDF features:
- Logo from /logo.png
- QR code from owner contact (vCard 3.0)
- Photo converted to JPEG data URL before PDF generation
- Generated fully client-side

---

## Text generation (Local-First)

Step 3 uses **template-based** text generation. No API calls, no data sent to any server.

1. User enters pet name, breed, keywords (comma-separated traits)
2. Clicks "Text automatisch generieren"
3. `generateText()` in AppContent.tsx builds text from translation templates:
   - Intro: pet name + breed
   - Middle: keywords from user input
   - Outro: generic closing phrase
4. Text is truncated to MAX_DESCRIPTION_LENGTH (470 chars)
5. User can edit the result manually

---

## Data persistence

All state lives in the browser. Nothing is sent to a server.

| Data | Storage | Notes |
|------|---------|-------|
| Form data (all fields except photo) | localStorage | pet-cv:form-data |
| Photo | IndexedDB | pet-cv:photo-blob |
| Form draft (during session) | sessionStorage | Cleared when tab closes |
| Theme, language, cookie consent | localStorage | UI preferences |

`StorageManager` selects adapter from `STORAGE_STRATEGIES`:
- Form data → LocalStorageAdapter
- Photos → IndexedDBAdapter (~10MB)
- Session-only → SessionStorageAdapter

**Mobile-friendly:** `visibilitychange` + `beforeunload` save form data when user switches tabs or closes the page.

---

## Form validation

`useFormValidation(data, step)` validates the current step. Forward navigation blocked if invalid.

| Step | Field | Rule |
|------|-------|------|
| 1 | ownerName | Required, min 2 characters |
| 1 | name (pet) | Required, min 1 character |
| 1 | petType | Required (dog / cat / other) |
| 1 | email | Optional, RFC 5322 format |
| 1 | phone | Optional, Swiss format: +41XXXXXXXXX or 0XXXXXXXXX |
| 1 | postal | Optional, Swiss PLZ: 1000-9999 |
| 2-6 | (all) | No required fields |

---

## Environment variables

Copy `.env.example` to `.env` for local overrides.

| Variable | Required | Description |
|----------|----------|-------------|
| CLOUDFLARE_TUNNEL_TOKEN | Yes (for tunnel) | Cloudflare Tunnel token for HTTPS |

No backend = no Redis, no API keys, no database.

---

## Deploying to VPS

### Requirements

- Linux VPS (Ubuntu 22.04+ recommended)
- Docker + Docker Compose v2
- Cloudflare Tunnel (or domain + SSL)

### Steps

**1. Clone and enter:**
```bash
git clone <repo-url> pet-bewerbung
cd pet-bewerbung
```

**2. Configure environment:**
```bash
cp .env.example .env
nano .env
# Set CLOUDFLARE_TUNNEL_TOKEN
```

**3. Start services:**
```bash
docker compose up -d --build
```

**4. Verify:**
```bash
docker compose ps          # frontend + tunnel healthy
curl http://localhost:3000 # Frontend served by Nginx
```

### Docker services

| Service | Image | Exposed port | Description |
|---------|-------|-------------|-------------|
| frontend | nginx:alpine | 3000 | Vite build served by Nginx |
| tunnel | cloudflare/cloudflared | - | HTTPS via Cloudflare |

### Nginx config (nginx.conf)

- **SPA routing**: `try_files $uri $uri/ /index.html` (all non-asset paths → React app)
- **Security headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP
- **Cache**: assets with content hash → 1 year immutable; index.html → no-cache

---

## Local development

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000 (Vite with HMR)
- Build: `npm run build` → dist/
- Preview: `npm run preview` (serve production build)

---

## Project root layout

```
pet-bewerbung/
|-- src/                    # Frontend (React + TypeScript)
|-- public/                 # Static assets (favicon, logo.png, manifest)
|-- Dockerfile              # Multi-stage: node build → nginx:alpine
|-- docker-compose.yml      # Production: frontend + tunnel
|-- nginx.conf              # Nginx config (SPA routing, no API proxy)
|-- vite.config.js          # Vite config
|-- tailwind.config.js      # Tailwind CSS config
|-- tsconfig.json           # TypeScript config
|-- package.json            # Dependencies
|-- .env.example            # Environment variable template
`-- README.md               # This file
```

---

## Security overview

| Mechanism | Implementation |
|-----------|---------------|
| No server storage | All data stays in browser. PDF generated client-side. |
| Security headers | Nginx: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP |
| Input sanitization | Frontend sanitization for user inputs |
| Image compression | Max 800x800, JPEG 0.8, max 500KB to prevent abuse |
| Blob URL cleanup | URL.revokeObjectURL after download (1–2s delay) |

---

## Privacy

- All form data stored **only in the user browser** (localStorage + IndexedDB)
- PDF generated entirely **client-side** — no document data sent anywhere
- Text generation is **template-based** — no AI, no external APIs
- No database, no server-side storage, no cookies beyond consent (if any)
