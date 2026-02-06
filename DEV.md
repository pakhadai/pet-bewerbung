# Development Guide

## Quick Start

### Option 1: Local Development (Recommended for fast iteration)

```bash
# Terminal 1: Start Redis (required for rate limiting)
docker run -d -p 6379:6379 --name pet-redis redis:7-alpine

# Terminal 2: Start Backend
cd server
npm install
npm start

# Terminal 3: Start Frontend
npm install
npm run dev
```

Open http://localhost:3000

### Option 2: Docker with Hot Reload

```bash
npm run dev:docker
# or
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**What this provides:**
- Frontend: Vite dev server on port 3000 with hot reload
- Backend: nodemon auto-restart on file changes
- Redis: For AI rate limiting
- Volumes: Code mounted from host, no rebuild needed

### Option 3: Full Docker (Production-like)

```bash
docker-compose up -d --build
```

## Environment Setup

### 1. Create `.env` in project root

```env
# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI (optional, get from https://aistudio.google.com/apikey)
GEMINI_API_KEY=...

# Security
JWT_SECRET=your-dev-secret-change-in-production

# Infrastructure
REDIS_URL=redis://localhost:6379
PORT=4242
```

### 2. Create `server/.env` (for local backend without Docker)

Copy same variables as above, or create symlink:
```bash
cd server && ln -s ../.env .env
```

## Project Structure Overview

```
├── src/                      # Frontend source
│   ├── components/
│   │   ├── steps/            # Wizard step components (Step1-6)
│   │   │   ├── index.js      # Exports all steps
│   │   │   ├── Step1Details.jsx
│   │   │   ├── Step2HealthInsurance.jsx
│   │   │   ├── Step3Description.jsx
│   │   │   ├── Step4UploadSelect.jsx
│   │   │   ├── Step5Preview.jsx
│   │   │   └── Step6ThankYou.jsx
│   │   ├── document/         # PDF section components
│   │   ├── SwissDocument.jsx # HTML preview renderer
│   │   ├── SwissDocumentPdf.jsx # PDF renderer
│   │   └── DocumentEditor.jsx # Visual editor
│   ├── translations/         # i18n (de, en, fr, it, rm, ua)
│   ├── hooks/                # useFormWizard, etc.
│   ├── contexts/             # React contexts
│   ├── App.tsx               # Main app component
│   └── constants.js          # Config, templates, initial data
│
├── server/                   # Backend source
│   ├── config/index.js       # Configuration
│   ├── controllers/
│   │   ├── stripe.js         # Payment endpoints
│   │   └── ai.js             # AI generation
│   ├── middleware/
│   │   ├── premium.js        # JWT handling
│   │   └── rateLimit.js      # Redis rate limiting
│   ├── utils/sanitize.js     # Input sanitization
│   └── index.js              # Express server
│
├── docker-compose.yml        # Production config
├── docker-compose.dev.yml    # Development overrides
└── nginx.conf                # Reverse proxy
```

## Common Development Tasks

### Adding a New Form Field

1. Add to `INITIAL_DATA` in `src/constants.js`:
   ```javascript
   const INITIAL_DATA = {
     // ...existing fields
     newField: '',
   };
   ```

2. Add input in relevant step component (e.g., `Step2HealthInsurance.jsx`):
   ```jsx
   <Input
     value={data.newField ?? ''}
     onChange={(e) => updateData('newField', e.target.value)}
   />
   ```

3. Add to PDF display in `SwissDocumentPdf.jsx` and `SwissDocument.jsx`

4. Add translations in `src/translations/*.js`:
   ```javascript
   labels: {
     newField: 'Label Text',
   }
   ```

### Adding a New Translation

1. Create file `src/translations/xx.js` (copy from `en.js`)
2. Export in `src/translations/index.js`:
   ```javascript
   export { default as xx } from './xx';
   ```
3. Add button in `LanguageSelector.jsx`

### Adding a New API Endpoint

1. Create handler in appropriate controller:
   ```javascript
   // server/controllers/ai.js
   router.post('/new-endpoint', async (req, res) => {
     // ...
   });
   ```

2. Add to `API_ENDPOINTS` in `src/config.js`:
   ```javascript
   newEndpoint: `${API_BASE}/new-endpoint`,
   ```

### Testing Stripe Payments Locally

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:4242/webhook
   ```
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`
5. Test payment in browser

### Debugging

**Frontend:**
```bash
# Check for TypeScript/lint errors
npm run lint

# Build to check for production issues
npm run build
```

**Backend:**
```bash
# Check health
curl http://localhost:4242/health

# Check Redis connection
docker exec pet-redis redis-cli ping

# View logs
docker-compose logs -f backend
```

**PDF Generation Issues:**
- Check browser console for React errors
- Verify `data` object has required fields
- Test `formatAddress()` helper
- Check `customDesign` in localStorage

## Cloudflare Tunnel (Remote Access)

### Development Mode

1. Edit tunnel in Cloudflare Zero Trust → Tunnels
2. Change Service from `http://frontend:80` to `http://frontend:3000`
3. Save

Now https://pet-bewerbung.ch shows Vite dev server with hot reload.

### Production Mode

1. Change Service back to `http://frontend:80`
2. Run `docker-compose up -d --build`

## Code Style

- Use `const` instead of `let` where possible
- Use optional chaining for translations: `t?.key?.subkey ?? 'fallback'`
- Components use React.memo for performance
- Controllers export Express Router instances
- Middleware uses async/await pattern

## Common Issues

### "Redis unavailable" in development
```bash
# Start Redis container
docker run -d -p 6379:6379 --name pet-redis redis:7-alpine

# Or restart existing
docker start pet-redis
```

### "JWT_SECRET required" error
Set `JWT_SECRET` in `.env` file. In production, server exits without it.

### "Port 3000 already in use"
```bash
# Find and kill process
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### PDF not generating
1. Check console for errors
2. Verify `pdf-document` element exists
3. Check if all required data fields are populated
4. Try different template

## Testing Checklist

Before committing:
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors
- [ ] All 6 steps navigate correctly
- [ ] AI generation works (with valid API key)
- [ ] PDF downloads correctly
- [ ] Premium flow works (payment → token → features)
- [ ] Visual editor applies changes to PDF
