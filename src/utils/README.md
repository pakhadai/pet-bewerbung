# Utility Modules

This directory contains reusable utility functions extracted from large components for better maintainability.

## 📦 Modules Overview

### `paymentHelpers.ts`
Payment-related utilities for Stripe integration.

**Functions:**
- `createCheckoutSession(params)` - Creates Stripe checkout session
- `parsePaymentParams()` - Parse URL payment parameters
- `cleanPaymentUrl()` - Remove payment params from URL
- `chfToCents(chf)` - Convert CHF to cents/Rappen

**Usage:**
```typescript
import { createCheckoutSession, chfToCents } from './utils/paymentHelpers';

const cents = chfToCents(10); // 1000
const result = await createCheckoutSession({
  amount: cents,
  currency: 'chf',
  paymentMethod: 'card'
});
```

---

### `pdfHelpers.ts`
PDF generation utilities.

**Functions:**
- `blobUrlToDataUrl(blobUrl)` - Convert blob URL to data URL
- `toJpegDataUrl(webpDataUrl)` - Convert WebP to JPEG
- `fetchLogoAsDataUrl()` - Fetch logo as data URL
- `generateQrDataUrl(content, options)` - Generate QR code
- `getQrContent(data)` - Get QR content from pet data
- `downloadPdfBlob(blob, filename, translations)` - Download PDF with device detection
- `handlePdfError(err, translations)` - Handle PDF errors with appropriate messages

**Usage:**
```typescript
import { downloadPdfBlob, handlePdfError } from './utils/pdfHelpers';

try {
  const blob = await generatePdfBlob();
  const result = downloadPdfBlob(blob, 'pet-cv.pdf', translations);
  showToast(result.message, result.type);
} catch (err) {
  const errorMsg = handlePdfError(err, translations);
  showToast(errorMsg, 'error');
}
```

---

### `aiHelpers.ts`
AI generation utilities.

**Functions:**
- `generatePetDescription(params)` - Generate AI description
- `getAIRateLimitStatus()` - Get rate limit info
- `preparePetDataForAI(data)` - Format data for AI

**Usage:**
```typescript
import { generatePetDescription, preparePetDataForAI } from './utils/aiHelpers';

const petData = preparePetDataForAI(formData);
const result = await generatePetDescription({
  petData,
  lang: 'de',
  premiumToken,
  deviceId,
  tone: 'formal'
});

if (result.error) {
  // Handle error
} else {
  // Use result.description
}
```

---

### `imageCompression.js`
Image compression utilities with timeout protection.

**Functions:**
- `compressImage(file, options)` - Compress image with timeout
- `toJpegDataUrl(dataUrl)` - Convert to JPEG
- `getBase64Size(base64)` - Get size of base64 string
- `formatFileSize(bytes)` - Format bytes to readable string

**Features:**
- 10-second timeout to prevent browser hanging
- Automatic WebP/JPEG fallback
- Canvas cleanup to prevent memory leaks
- Iterative quality adjustment

**Usage:**
```typescript
import { compressImage } from './utils/imageCompression';

try {
  const compressed = await compressImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    maxSizeKB: 500,
    timeout: 10000 // 10 seconds
  });
  // Use compressed image
} catch (err) {
  if (err.message.includes('timeout')) {
    alert('Image too large - compression timed out');
  }
}
```

---

### `swissValidation.js`
Swiss-specific validation utilities.

**Functions:**
- `validateSwissPhone(phone)` - Validate Swiss phone format
- `formatSwissPhone(phone)` - Format to +41 XX XXX XX XX
- `validateSwissPostal(postal)` - Validate 4-digit PLZ
- `validateEmail(email)` - RFC 5322 compliant validation

**Improvements:**
- ✅ Fixed phone validation to accept all Swiss area codes
- ✅ Enhanced email validation with consecutive dot checks
- ✅ Proper null/undefined handling

---

## 🧩 Component Modules

### `ErrorBoundary.tsx`
React Error Boundary for catching rendering errors.

**Usage:**
```tsx
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary onError={(error, info) => console.error(error)}>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Development mode error details
- Refresh and retry buttons
- Custom fallback UI support

---

### `LoadingSpinner.tsx`
Reusable loading indicator.

**Usage:**
```tsx
import LoadingSpinner from './components/LoadingSpinner';

<LoadingSpinner
  message="Generating PDF..."
  size="large"
  fullScreen={true}
/>
```

**Props:**
- `message` - Optional loading message
- `size` - 'small' | 'medium' | 'large'
- `fullScreen` - Cover entire screen

---

## 📊 Benefits of Modularization

### Before:
- 📄 App.tsx: **1,161 lines**
- 📄 SwissDocument.jsx: **1,652 lines**
- 😰 Hard to maintain
- 😰 Difficult to test
- 😰 Code duplication

### After:
- ✅ Smaller, focused modules
- ✅ Reusable across components
- ✅ Easier to test individually
- ✅ Better code organization
- ✅ TypeScript type safety

---

## 🔄 Migration Guide

### Old way (in App.tsx):
```typescript
// 100+ lines of payment logic inline
const handleCheckout = async () => {
  const res = await fetch(...);
  // ... complex error handling
  // ... URL parsing
  // ... etc.
};
```

### New way:
```typescript
import { createCheckoutSession, parsePaymentParams } from './utils/paymentHelpers';

const handleCheckout = async () => {
  const result = await createCheckoutSession({ amount: 1000 });
  if (result.error) {
    showToast(result.error, 'error');
  } else {
    window.open(result.url, '_blank');
  }
};
```

**Benefits:**
- 🎯 Clear, focused functions
- 📝 Better error messages
- 🧪 Testable in isolation
- 📚 Documented interfaces

---

## 🛠️ Development Tips

1. **Import what you need:**
   ```typescript
   import { createCheckoutSession } from './utils/paymentHelpers';
   ```

2. **Check return types:**
   ```typescript
   const result: CheckoutSessionResponse = await createCheckoutSession(...);
   ```

3. **Handle errors gracefully:**
   ```typescript
   if (result.error) {
     // Handle specific error types
   }
   ```

4. **Use TypeScript benefits:**
   ```typescript
   // IDE will autocomplete and type-check
   const params: AIGenerationParams = { ... };
   ```

---

## 📈 Future Improvements

Potential areas for further modularization:
- [ ] Extract step components into separate directory
- [ ] Create translation helper utilities
- [ ] Extract theme management
- [ ] Create form validation helpers
- [ ] Add unit tests for helpers

---

**Last Updated:** 2026-02-07
