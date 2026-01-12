# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wuff-Bewerbung (Pet CV)** is a web application that generates professional Swiss-standard pet application dossiers (CVs) for apartment rental applications. The application helps pet owners increase their chances of finding housing by creating a formal PDF document with pet details, owner information, insurance, and health records.

## Development Commands

### Frontend (Vite + React)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend (Stripe Server)
```bash
cd server
npm install          # Install server dependencies
npm start            # Start Express server on http://localhost:4242
```

### Run Both Concurrently
```bash
npm run dev:all      # Runs both frontend and backend simultaneously
```

### Stripe Configuration
1. Copy `server/.env.example` to `server/.env`
2. Set `STRIPE_SECRET_KEY` with test key (starts with `sk_test_`)
3. Set `STRIPE_PUBLISHABLE_KEY` with test key (starts with `pk_test_`)
4. Optionally set `STRIPE_WEBHOOK_SECRET` for webhook verification
5. Server listens on port 4242 by default (configurable via `PORT` env var)

## Architecture

### Application Flow
The app uses a **step-based wizard** (0-8) to guide users through creating a pet CV:

- **Step 0**: Landing page with features and call-to-action
- **Step 1**: Owner information (name, address, email, phone)
- **Step 2**: Pet details (type, name, breed, age, weight, gender)
- **Step 3**: Health & insurance (chip ID, vet, insurance, neutered/vaccinated/registered status)
- **Step 4**: Character description with AI text generation (transforms keywords into professional text)
- **Step 5**: Photo upload
- **Step 6**: Template selection (classic, modern, compact) - displays previews
- **Step 7**: Document preview and download options (PDF or email)
- **Step 8**: Thank you page with optional donation flow

### State Management
All application state is managed in [App.jsx](src/App.jsx) using React useState:
- `step`: Current wizard step (0-8)
- `data`: Form data object with all pet and owner information
- `theme`: Light/dark theme toggle
- `templateType`: Selected PDF template (classic/modern/compact)
- `donationAmount` + modal states: Stripe payment flow

Navigation between steps uses `goToStep()` which handles animation direction (`animDir`) for smooth transitions.

### Multi-Language Support
Six languages supported via [constants.js](src/constants.js):
- German (de) - Default
- French (fr)
- Italian (it)
- Romansh (rm)
- English (en)
- Ukrainian (ua)

Language auto-detected from browser on first load. All UI text comes from the `TRANSLATIONS` object in constants.js.

### PDF Generation
Three template variants in [SwissDocument.jsx](src/components/SwissDocument.jsx):
- **classic**: Traditional Swiss document style (black borders, gray sections)
- **modern**: Contemporary design (blue accents, rounded corners)
- **compact**: Space-efficient layout (smaller margins, reduced text size)

Templates use CSS classes for A4 dimensions (210mm × 297mm) and are rendered to PDF via html2pdf.js. The document element has `id="pdf-document"` for export.

### Payment Integration
Two payment flows in [server/index.js](server/index.js):
1. **Stripe Checkout** (`/create-checkout-session`): Hosted payment page with support for card and TWINT
2. **Payment Elements** (`/create-payment-intent`): Embedded payment form with real-time status updates

Payment status tracked in-memory on server. Webhook endpoint (`/webhook`) handles Stripe events for payment status updates.

## Key Files

### Frontend
- [src/App.jsx](src/App.jsx): Main application component with step routing and state
- [src/constants.js](src/constants.js): Translations, initial data, template options
- [src/components/SwissDocument.jsx](src/components/SwissDocument.jsx): PDF document templates (3 variants)
- [src/components/LandingPage.jsx](src/components/LandingPage.jsx): Marketing landing page (step 0)
- [src/components/DonateModal.jsx](src/components/DonateModal.jsx): Donation method selection modal
- [src/components/PaymentModal.jsx](src/components/PaymentModal.jsx): Stripe Elements payment form
- [src/theme.js](src/theme.js): Theme configuration (colors, fonts)

### Backend
- [server/index.js](server/index.js): Express server with Stripe integration
- [server/.env.example](server/.env.example): Environment variables template

### Configuration
- [vite.config.js](vite.config.js): Vite dev server on port 3000, host enabled for network access
- [package.json](package.json): Frontend dependencies and scripts

## Important Patterns

### Adding a New Language
1. Add language code to constants.js in `TRANSLATIONS` object
2. Include all translation keys (landing, steps, labels, doc, monetization, thankYou, templates)
3. Add language to `detectLang()` function in App.jsx if needed
4. Update LanguageSelector component if adding to UI dropdown

### Adding a New Template
1. Add template config to `TEMPLATE_OPTIONS` in constants.js
2. Add variant styles in `getVariantStyles()` in SwissDocument.jsx
3. Template should render at exactly 210mm × 297mm for A4 PDF output
4. Add preview thumbnail to step 6 template grid

### Modifying Form Steps
- Step content defined in `renderStep()` switch statement in App.jsx
- Each step should update `data` state via `updateData(field, value)`
- Navigation controlled by `goToStep(newStep)` function
- Bottom navigation panel shown for steps 1-7

### PDF Export
PDF generated in `handleDownloadPDF()` function:
- Target element: `document.getElementById('pdf-document')`
- Uses html2pdf.js with A4 portrait, 2x scale for quality
- Auto-redirects to step 8 (thank you) after download
- Template selected via `selectedTemplate` state variable

### Stripe Payments
Backend expects:
- `amount` in cents (e.g., 500 for 5 CHF)
- `currency` defaulting to 'eur'
- `successUrl` and `cancelUrl` for checkout redirect
- `payment_method` for method selection ('card' or 'twint')

## API Configuration

### Stripe Endpoints
API endpoints are centralized in [src/config.js](src/config.js):
- **Development**: Uses `http://localhost:4242` by default
- **Production**: Reads from `VITE_STRIPE_API_URL` environment variable
- Create `.env` file from `.env.example` and set `VITE_STRIPE_API_URL` for custom endpoints

All API calls use `API_ENDPOINTS` from config:
```javascript
import API_ENDPOINTS from './config';
fetch(API_ENDPOINTS.createCheckoutSession, {...})
```

Available endpoints:
- `createCheckoutSession` - Create Stripe Checkout session
- `createPaymentIntent` - Create Payment Intent for embedded form
- `stripeConfig` - Get Stripe publishable key
- `paymentStatus(id)` - Check payment status by ID

## Data Privacy Note
The app emphasizes that **no data is stored on the server** - all document generation happens client-side. This is a key selling point mentioned in translations and should be preserved in any changes.
