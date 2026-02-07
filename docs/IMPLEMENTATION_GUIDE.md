# Implementation Guide - New Features

Complete guide for integrating the new improvements into your application.

---

## 📚 Table of Contents

1. [Context API Setup](#1-context-api-setup)
2. [Request Size Limits](#2-request-size-limits)
3. [CSRF Protection](#3-csrf-protection)
4. [Logging Service](#4-logging-service)
5. [Unit Testing](#5-unit-testing)

---

## 1. Context API Setup

### Why Context API?

**Before:** Props passed through 5+ component levels
**After:** Direct access via hooks from any component

### Installation Steps

#### Step 1: Wrap your app with providers

**In `src/App.tsx`:**

```tsx
import { AppContextProvider } from './contexts/AppContext';
import { useFormWizard, usePremium } from './hooks/useFormWizard';

function App() {
  const { darkMode, toggleTheme } = useTheme();
  const { t, lang, setLang } = useTranslations();
  const { isPremium, premiumToken, deviceId, activatePremium, clearPremium } = usePremium();
  const { showToast } = useToast();

  return (
    <AppContextProvider
      theme={{ darkMode, toggleTheme }}
      translations={{ t, lang, setLang }}
      premium={{ isPremium, premiumToken, deviceId, activatePremium, clearPremium, timeRemaining: 0 }}
      toast={{ showToast }}
    >
      {/* Your app components */}
    </AppContextProvider>
  );
}
```

#### Step 2: Use contexts in child components

**Before (prop drilling):**
```tsx
function StepComponent({ t, darkMode, isPremium, showToast }) {
  // Component code
}

// In parent:
<StepComponent
  t={t}
  darkMode={darkMode}
  isPremium={isPremium}
  showToast={showToast}
/>
```

**After (Context API):**
```tsx
import { useTranslations, useTheme, usePremium, useToast } from './contexts/AppContext';

function StepComponent() {
  const { t } = useTranslations();
  const { darkMode } = useTheme();
  const { isPremium } = usePremium();
  const { showToast } = useToast();

  // Component code - no props needed!
}

// In parent:
<StepComponent />
```

**Benefits:**
- ✅ No prop drilling
- ✅ Cleaner component signatures
- ✅ Easier to add new global state
- ✅ Better TypeScript support

---

## 2. Request Size Limits

### Why Request Limits?

Prevents DoS attacks via large payloads and bandwidth abuse.

### Installation Steps

#### Step 1: Add middleware to server

**In `server/index.js`:**

```javascript
const { checkRequestSize, trackRequestSize } = require('./middleware/requestLimits');

// Add BEFORE body parsing
app.use(checkRequestSize);
app.use(trackRequestSize);

// Then add body parsing
app.use(express.json());
```

#### Step 2: Configure custom limits (optional)

```javascript
const { createSizeLimit } = require('./middleware/requestLimits');

// Custom limit for specific endpoint
app.post('/api/upload', createSizeLimit(10 * 1024 * 1024), (req, res) => {
  // Max 10MB for this endpoint
});
```

### Default Limits

| Endpoint | Limit | Purpose |
|----------|-------|---------|
| Default | 1 MB | General endpoints |
| `/api/generate-pet-description` | 50 KB | Text only |
| `/api/improve-text` | 100 KB | Text processing |
| `/api/create-checkout-session` | 10 KB | Payment metadata |
| `/webhook` | 1 MB | Stripe webhooks |

### Error Response

```json
{
  "error": "Request payload too large",
  "message": "Maximum size: 0.05MB, received: 0.12MB",
  "limit": 51200,
  "received": 122880
}
```

**Status Code:** 413 Payload Too Large

---

## 3. CSRF Protection

### Why CSRF Protection?

Prevents Cross-Site Request Forgery attacks where malicious sites make requests on behalf of authenticated users.

### Installation Steps

#### Step 1: Add middleware to server

**In `server/index.js`:**

```javascript
const { provideCsrfToken, smartCsrfProtection, getCsrfTokenEndpoint } = require('./middleware/csrf');

// Provide CSRF token on all GET requests
app.use(provideCsrfToken);

// Protect state-changing requests (POST, PUT, DELETE)
app.use(smartCsrfProtection);

// Endpoint to get CSRF token
app.get('/api/csrf-token', getCsrfTokenEndpoint);
```

#### Step 2: Update frontend to send CSRF token

**In `src/utils/api.ts`:**

```typescript
// Get CSRF token on app init
let csrfToken: string | null = null;

export async function initCsrf() {
  const res = await fetch('/api/csrf-token');
  const data = await res.json();
  csrfToken = data.csrfToken;
}

// Include token in all POST requests
export async function apiPost(url: string, body: any) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '',
    },
    body: JSON.stringify(body),
  });
}
```

**In `src/App.tsx`:**

```typescript
import { initCsrf } from './utils/api';

useEffect(() => {
  initCsrf(); // Get CSRF token on mount
}, []);
```

### Configuration

Skip CSRF for specific paths:

```javascript
const { csrfConfig } = require('./middleware/csrf');

// Add paths to skip
csrfConfig.skipPaths.push('/api/public-endpoint');
```

### Error Response

```json
{
  "error": "CSRF token missing",
  "message": "CSRF token is required for this request"
}
```

**Status Code:** 403 Forbidden

---

## 4. Logging Service

### Why Centralized Logging?

- ✅ Structured logs for easy parsing
- ✅ Different log levels (error, warn, info, debug)
- ✅ Security event tracking
- ✅ Production-ready JSON format

### Installation Steps

#### Step 1: Replace console.log with logger

**Before:**
```javascript
console.log('User created:', userId);
console.error('Database error:', err);
```

**After:**
```javascript
const { logger } = require('./utils/logger');

logger.info('User created', { userId });
logger.error('Database error', { error: err.message });
```

#### Step 2: Add request logging middleware

**In `server/index.js`:**

```javascript
const { requestLogger, errorLogger, logStartup } = require('./utils/logger');

// Add request logging
app.use(requestLogger);

// Add error logging (after all routes)
app.use(errorLogger);

// Log startup
logStartup({ port: 4242 });
```

#### Step 3: Use context-specific loggers

```javascript
const { createLogger } = require('./utils/logger');

const stripeLogger = createLogger('stripe');
stripeLogger.info('Payment processed', { amount: 1000 });

const aiLogger = createLogger('ai');
aiLogger.debug('AI request', { prompt: 'Generate description' });
```

### Log Levels

Set via `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=debug npm start  # Development
LOG_LEVEL=info npm start   # Production (default)
```

| Level | When to Use |
|-------|-------------|
| `ERROR` | Errors that need immediate attention |
| `WARN` | Warning conditions, potential issues |
| `INFO` | General informational messages |
| `DEBUG` | Detailed debugging information |

### Security Logging

```javascript
const { securityLogger } = require('./utils/logger');

securityLogger.rateLimitExceeded(ip, '/api/generate');
securityLogger.csrfViolation(ip, '/api/checkout');
securityLogger.tokenValidationFailed(ip, 'expired');
securityLogger.suspiciousActivity(ip, 'multiple failed attempts');
```

### Output Format

**Development:**
```
[2026-02-07T10:30:45.123Z] INFO: HTTP Request
  {
    "method": "POST",
    "path": "/api/generate",
    "ip": "127.0.0.1"
  }
```

**Production (JSON):**
```json
{
  "timestamp": "2026-02-07T10:30:45.123Z",
  "level": "info",
  "message": "HTTP Request",
  "method": "POST",
  "path": "/api/generate",
  "ip": "127.0.0.1",
  "context": "app"
}
```

---

## 5. Unit Testing

### Why Unit Tests?

- ✅ Catch bugs early
- ✅ Refactor with confidence
- ✅ Documentation via examples
- ✅ Better code quality

### Installation Steps

#### Step 1: Install dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

#### Step 2: Add test scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### Step 3: Run tests

```bash
npm test              # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Writing Tests

Create test files next to your code:

```
src/utils/
├── paymentHelpers.ts
├── __tests__/
│   ├── paymentHelpers.test.ts
│   └── swissValidation.test.js
```

**Example test:**

```typescript
import { describe, it, expect } from 'vitest';
import { chfToCents } from '../paymentHelpers';

describe('chfToCents', () => {
  it('should convert CHF to cents', () => {
    expect(chfToCents(10)).toBe(1000);
    expect(chfToCents(5.5)).toBe(550);
  });

  it('should throw for invalid amounts', () => {
    expect(() => chfToCents(-10)).toThrow('Invalid amount');
  });
});
```

### Test Coverage

Aim for:
- ✅ 80%+ coverage for utilities
- ✅ 60%+ coverage for components
- ✅ 100% coverage for critical paths (auth, payment)

View coverage report:
```bash
npm run test:coverage
open coverage/index.html  # View in browser
```

---

## 🚀 Deployment Checklist

Before deploying with new features:

### Environment Variables

```bash
# Required
JWT_SECRET=<32+ characters>
STRIPE_WEBHOOK_SECRET=<whsec_...>
REDIS_URL=<redis://...>

# Optional
LOG_LEVEL=info  # error|warn|info|debug
CSRF_ENABLED=true
```

### Server Setup

1. ✅ Add request size limits middleware
2. ✅ Add CSRF protection middleware
3. ✅ Add logging middleware
4. ✅ Configure log level for production

### Frontend Setup

1. ✅ Wrap app with Context providers
2. ✅ Initialize CSRF token on mount
3. ✅ Include CSRF token in all POST requests
4. ✅ Use Context hooks instead of props

### Testing

1. ✅ Run unit tests: `npm test`
2. ✅ Check coverage: `npm run test:coverage`
3. ✅ Test CSRF protection manually
4. ✅ Test request size limits
5. ✅ Verify logging output

---

## 📊 Performance Impact

| Feature | Impact | Notes |
|---------|--------|-------|
| Context API | Negligible | May reduce re-renders |
| Request Limits | ~1ms per request | Header parsing only |
| CSRF Protection | ~2ms per request | Token validation |
| Logging | ~0.5ms per log | JSON stringification |

**Total overhead:** ~3-4ms per request (negligible)

---

## 🐛 Troubleshooting

### CSRF token missing error

**Problem:** Getting 403 Forbidden with "CSRF token missing"

**Solutions:**
1. Ensure `initCsrf()` is called on app mount
2. Check CSRF token is included in request headers
3. Verify endpoint is not in `skipPaths`

### Request too large error

**Problem:** Getting 413 Payload Too Large

**Solutions:**
1. Reduce payload size (compress images, trim data)
2. Increase limit for specific endpoint with `createSizeLimit()`
3. Split large requests into smaller chunks

### Logs not appearing

**Problem:** Logger not outputting logs

**Solutions:**
1. Check `LOG_LEVEL` environment variable
2. Ensure log level is high enough (debug > info > warn > error)
3. Verify logger is imported correctly

---

## 📚 Additional Resources

- [Context API React Docs](https://react.dev/reference/react/createContext)
- [CSRF Protection Guide](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Vitest Documentation](https://vitest.dev/)
- [Logging Best Practices](https://www.loggly.com/blog/logging-best-practices/)

---

**Last Updated:** 2026-02-07
**Version:** 1.0.0
