# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pet-Bewerbung (Pet CV)** is a web application that generates professional Swiss-standard pet application dossiers (CVs) for apartment rental applications. The application helps pet owners increase their chances of finding housing by creating a formal PDF document with pet details, owner information, insurance, and health records.

**Live Site**: https://pet-bewerbung.ch

## Development Commands

### Frontend (Vite + React)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend (Express + Stripe + AI)
```bash
cd server
npm install          # Install server dependencies
npm start            # Start Express server on http://localhost:4242
```

### Run Both Concurrently
```bash
npm run dev:all      # Runs both frontend and backend simultaneously
```

### Docker
```bash
docker-compose up -d --build          # Production build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up  # Dev with hot reload
```

## Architecture

### Application Flow
The app uses a **step-based wizard** (0-6) to guide users through creating a pet CV:

| Step | Component | Description |
|------|-----------|-------------|
| 0 | `Hero.tsx` | Landing page with features and CTA |
| 1 | `Step1Details.jsx` | Owner info + pet basic info (name, type, breed, age) |
| 2 | `Step2HealthInsurance.jsx` | Vet, insurance, chip, behavior, references |
| 3 | `Step3Description.jsx` | AI text generation with premium sliders |
| 4 | `Step4UploadSelect.jsx` | Photo upload + template selection |
| 5 | `Step5Preview.jsx` | Document preview + download + visual editor |
| 6 | `Step6ThankYou.jsx` | Thank you page + donation options |

### Frontend State Management (Refactored)

As of the latest refactoring, the frontend has been modularized for better maintainability:

**Entry Point**: `src/App.tsx` (26 lines)
- Clean composition: wraps `AppProviders` and `AppContent`
- No business logic, purely structural

**Main Layers**:
1. **AppProviders.tsx** (30 lines) - Error boundary and setup
2. **AppContent.tsx** (450 lines) - All business logic:
   - PDF generation (`handleDownloadPDF`, `generatePdfBlob`, `handleDownloadAllTemplates`)
   - AI text generation (`generateText`, `generateFallbackText`)
   - Payment handling (`handleDonateMethod`)
   - Data conversion and utilities
3. **AppContainer.tsx** (500 lines) - UI orchestration:
   - Step-based routing (0-7)
   - Modal and navigation management
   - Theme and cookie handling
4. **Routes** (`src/routes/`) - Step-specific components:
   - `WizardRoute.tsx` - Steps 1-6 rendering
   - `HeroRoute.tsx` - Landing page (step 0)
   - `ThankYouRoute.tsx` - Thank you page (step 7)

**State Management**:
- Step, form data, theme, premium status via custom hooks
- Custom hooks in `src/hooks/`:
  - `useFormWizard`: Main wizard logic
  - `usePremium`: Premium features
  - `useToast`: Toast notifications
  - `usePaymentFlow`: Donation/payment state
  - `useTemplateSelection`: Template management

**Backup**: Original monolithic file preserved as `src/App.legacy.tsx`

**Documentation**:
- `docs/ARCHITECTURE.md` - Detailed architecture guide
- `docs/REFACTORING_GUIDE.md` - Developer guide
- `REFACTORING_NOTES.md` - Summary of changes

### Backend Architecture (Modular)

```
server/
├── index.js              # Entry point, middleware setup, routes
├── config/
│   └── index.js          # Centralized configuration, env validation
├── controllers/
│   ├── index.js          # Controller exports
│   ├── stripe.js         # Payment endpoints
│   └── ai.js             # AI generation endpoints
├── middleware/
│   ├── premium.js        # JWT token management
│   └── rateLimit.js      # Redis-based rate limiting
└── utils/
    └── sanitize.js       # Input sanitization
```

**Key Backend Features:**
- Modular controller architecture
- Redis-based rate limiting (REQUIRED in production)
- JWT-based premium session management (2-hour access)
- Input sanitization for AI prompts (prompt injection protection)
- Production-required environment variables validation

### Multi-Language Support
Six languages in `src/translations/`:
- `de.js` - German (Default)
- `fr.js` - French
- `it.js` - Italian
- `rm.js` - Romansh
- `en.js` - English
- `ua.js` - Ukrainian

Language auto-detected from browser. All UI text accessed via `t?.key?.subkey` pattern.

### PDF Generation
Two rendering systems:

1. **HTML Preview** (`SwissDocument.jsx`):
   - Renders A4 document (210mm × 297mm) in browser
   - Supports 4 templates + visual editor customization
   - Dynamic section rendering based on `customDesign`

2. **PDF Export** (`SwissDocumentPdf.jsx`):
   - Uses `@react-pdf/renderer` for server-side PDF
   - Mirrors HTML structure with PDF-specific components
   - Applies `customDesign` (colors, fonts, visibility, layout)

### Premium Model (Freemium)

**Free Tier:**
- Classic template only
- 1 AI generation per session
- No visual editor

**Premium (10 CHF, 2-hour access):**
- All 4 templates
- Unlimited AI generations
- Visual editor (colors, fonts, bold/italic)
- Download all templates as ZIP
- Character constructor with sliders

**Technical Implementation:**
- JWT token with 2-hour expiration
- Token bound to `deviceId` (stored in localStorage)
- Restore mechanism via email link
- Premium check: `verifyPremiumToken(token, deviceId)`

### Visual Editor (Premium Feature)

Located in `DocumentEditor.jsx`. Allows customization of:
- Header color, text color, accent color, background color
- Header font, body font (Inter, Roboto, Open Sans, etc.)
- Bold/italic toggles for headers and body
- Section visibility (hide elements)

Changes stored in `localStorage` as `customDesign` object and applied to both HTML preview and PDF.

## Key Files

### Frontend (Refactored Structure)
| File | Purpose |
|------|---------|
| `src/App.tsx` | Entry point, composition layer (26 lines) |
| `src/components/AppProviders.tsx` | Error boundary setup |
| `src/components/AppContainer.tsx` | UI routing and orchestration (500 lines) |
| `src/components/AppContent.tsx` | Business logic - PDF, AI, payments (450 lines) |
| `src/routes/WizardRoute.tsx` | Steps 1-6 rendering |
| `src/routes/HeroRoute.tsx` | Landing page (step 0) |
| `src/routes/ThankYouRoute.tsx` | Thank you page (step 7) |
| `src/App.legacy.tsx` | Original monolithic file (backup, 44 KB) |
| `src/constants.js` | Template options, initial data |
| `src/config.js` | API endpoint configuration |
| `src/components/SwissDocument.jsx` | HTML document preview (4 templates) |
| `src/components/SwissDocumentPdf.jsx` | PDF renderer |
| `src/components/DocumentEditor.jsx` | Visual editor UI |
| `src/components/steps/` | Individual step components |
| `src/hooks/useFormWizard.ts` | Main wizard hook - state & navigation |
| `src/hooks/usePremium.ts` | Premium features |
| `src/hooks/useToast.ts` | Toast notifications |
| `src/translations/*.js` | i18n files (6 languages) |

### Backend
| File | Purpose |
|------|---------|
| `server/index.js` | Express entry, middleware, route mounting |
| `server/config/index.js` | Environment validation, constants |
| `server/controllers/stripe.js` | Checkout, payment intent, webhooks, premium activation |
| `server/controllers/ai.js` | Pet description generation, text improvement |
| `server/middleware/premium.js` | JWT creation/verification |
| `server/middleware/rateLimit.js` | Redis-based AI rate limiting |
| `server/utils/sanitize.js` | Input sanitization |

## Important Patterns

### Adding a New Language
1. Create `src/translations/xx.js` based on `en.js`
2. Add export in `src/translations/index.js`
3. Add language button in `LanguageSelector.jsx`
4. Add to `detectLang()` in `App.tsx` if needed

### Adding a New Template
1. Add config to `TEMPLATE_OPTIONS` in `constants.js`:
   ```javascript
   { id: 'new', label: 'New Style', isPremium: true, price: 10 }
   ```
2. Add variant case in `SwissDocument.jsx` `getVariantStyles()`
3. Add variant case in `SwissDocumentPdf.jsx`
4. Template must render at exactly 210mm × 297mm

### Modifying Form Steps
- Steps defined in `App.tsx` `renderStep()` switch
- Each step receives: `data`, `updateData`, `t`, `animDir`, `darkMode`, `onPrev`, `onNext`
- Update `data` via `updateData('fieldName', value)`
- Navigation via `goToStep(stepNumber)`

### API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/stripe-config` | GET | - | Get publishable key |
| `/api/create-checkout-session` | POST | - | Create Stripe Checkout |
| `/api/create-payment-intent` | POST | - | Create Payment Intent |
| `/api/activate-premium` | POST | - | Activate after payment |
| `/api/generate-restore-link` | POST | JWT | Generate restore email |
| `/api/verify-restore` | GET | - | Verify restore token |
| `/api/generate-pet-description` | POST | - | AI generation (rate limited) |
| `/api/improve-text` | POST | JWT | AI text improvement |
| `/api/webhook` | POST | Stripe sig | Stripe webhooks |
| `/health` | GET | - | Health check |

### Environment Variables

**Required in Production:**
```env
JWT_SECRET=...              # REQUIRED - server exits without it
STRIPE_WEBHOOK_SECRET=...   # REQUIRED - server exits without it
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
REDIS_URL=...               # REQUIRED - rate limiting won't work
```

**Optional:**
```env
GEMINI_API_KEY=...          # For AI features
PORT=4242                   # Server port
ALLOWED_ORIGINS=...         # CORS origins (comma-separated)
```

### Rate Limiting (AI)
- Free users: 3 AI generations per 24 hours
- Premium users: Unlimited
- Implemented via Redis in `server/middleware/rateLimit.js`
- Redis is REQUIRED in production (server exits if unavailable)
- In development, rate limiting is disabled if Redis unavailable

## Data Privacy

**Key principle**: No user data is stored on the server.
- All document generation happens client-side
- Form data stored only in browser localStorage
- Premium tokens are stateless JWTs
- Only payment metadata stored by Stripe

This is a key selling point and must be preserved in any changes.

## Common Tasks

### Debug PDF Generation
1. Check browser console for errors
2. Verify `data` object has all required fields
3. Test with `formatAddress()` helper for address formatting
4. Check `customDesign` object in localStorage

### Debug Payment Issues
1. Check `/health` endpoint for Redis status
2. Verify Stripe keys in environment
3. Test webhook with `stripe listen --forward-to localhost:4242/webhook`
4. Check `payment-status/:id` endpoint

### Debug AI Generation
1. Verify `GEMINI_API_KEY` is set
2. Check rate limit status (Redis)
3. Look for sanitization issues in server logs
4. Verify pet data is passed correctly

## Testing

```bash
# Frontend linting
npm run lint

# Backend health check
curl http://localhost:4242/health

# Stripe webhook testing
stripe listen --forward-to localhost:4242/webhook
```

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 80 | Nginx serving React build |
| backend | 4242 | Express API |
| redis | 6379 | Rate limiting cache |
| tunnel | - | Cloudflare Tunnel |

## Notes for AI Assistants

### Architecture (Post-Refactoring)
1. **Entry Point**: `src/App.tsx` is now a minimal composition layer (26 lines)
   - Only imports AppProviders and AppContent
   - All logic delegated to child components
   - Original file backed up as `src/App.legacy.tsx`

2. **Business Logic**: Locate in `src/components/AppContent.tsx`
   - PDF generation functions: `handleDownloadPDF`, `generatePdfBlob`, `handleDownloadAllTemplates`
   - AI text generation: `generateText`, `generateFallbackText`
   - Payment handling: `handleDonateMethod`

3. **UI Orchestration**: Locate in `src/components/AppContainer.tsx`
   - Step-based routing logic
   - Modal state management
   - Theme and cookie handling
   - Navigation components

4. **Step Rendering**: Locate in `src/routes/`
   - `WizardRoute.tsx` - Steps 1-6
   - `HeroRoute.tsx` - Step 0 (landing)
   - `ThankYouRoute.tsx` - Step 7 (thank you)

### Development Patterns
5. **Step file naming**: Files are named `Step1Details`, `Step2HealthInsurance`, etc. to match step numbers
6. **Translation access**: Always use optional chaining `t?.key?.subkey ?? 'fallback'`
7. **Premium checks**: Use `isPremium` from `usePremium` hook
8. **PDF changes**: Must update both `SwissDocument.jsx` (HTML) and `SwissDocumentPdf.jsx` (PDF)
9. **New fields**: Add to `INITIAL_DATA` in `constants.js` and relevant translation files
10. **Adding features**: See `docs/REFACTORING_GUIDE.md` section "Adding New Features"

### Documentation
- Read `docs/ARCHITECTURE.md` for detailed architecture
- Read `docs/REFACTORING_GUIDE.md` for development guide
- Check `REFACTORING_NOTES.md` for summary of changes
