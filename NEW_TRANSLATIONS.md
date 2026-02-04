# Freemium Implementation Notes

## ✅ IMPLEMENTED

### 1. 🔗 Партнерське посилання через .env
- **File**: `src/components/steps/Step3HealthInsurance.jsx`
- **Env variable**: `VITE_INSURANCE_AFFILIATE_LINK`
- **Behavior**: Shows insurance recommendation when field is empty/short
- To activate: Add affiliate link to `.env` file:
  ```
  VITE_INSURANCE_AFFILIATE_LINK=https://partner-link.com
  ```

### 2. 💎 Freemium Model
- **Classic template**: FREE
- **Modern, Compact, Swiss**: PREMIUM (10 CHF one-time)
- **Premium benefits**:
  - All 4 templates
  - No watermark on premium templates
  - Unlimited AI text generations

### 3. 📊 Files Modified

#### Frontend:
- `src/constants.js` - Added `isPremium`, `price` to TEMPLATE_OPTIONS
- `src/hooks/useFormWizard.js` - Added `usePremium`, `useAIGenerations` hooks
- `src/hooks/index.js` - Exported new hooks
- `src/App.tsx` - Integrated premium state and purchase flow
- `src/config.js` - Added restore endpoints

#### Step Components:
- `Step3HealthInsurance.jsx` - Affiliate block
- `Step4Description.jsx` - AI generation limits for free users
- `Step3UploadSelect.jsx` - FREE/PREMIUM badges on templates
- `Step8Preview.jsx` - Premium purchase flow with comparison

#### PDF:
- `SwissDocumentPdf.jsx` - Watermark for unpaid premium templates

#### Backend:
- `server/index.js` - Premium restoration endpoints

#### Translations:
- `src/translations/de.js` - Added `affiliate` and `premium` sections
- `src/translations/en.js` - Added `affiliate` and `premium` sections

### 4. 🔄 Premium Restoration Mechanism
- After purchase, user can restore premium via URL: `?restore=<token>`
- Token is verified with server
- Premium status stored in localStorage

### 5. 📝 Environment Variables to Add
```env
# Insurance affiliate link (optional)
VITE_INSURANCE_AFFILIATE_LINK=

# Frontend URL (for restore links)
FRONTEND_URL=https://pet-bewerbung.ch
```

## 🎨 UX Notes:
- Users can SELECT premium templates even without paying
- Watermark overlay shown on preview for unpaid premium
- Payment button appears instead of download for premium templates
- Free template (Classic) always available as fallback

## 💳 Payment Flow:
1. User selects premium template
2. Preview shows watermark overlay
3. User clicks "Buy & Download" (10 CHF)
4. Stripe Checkout opens
5. On success: `?premium_success=true` → Premium activated → PDF downloads
6. Premium status saved to localStorage
7. Restore link generated for email

## 🔒 Premium Loss Protection:
- Premium stored in localStorage (persists browser close)
- Restore mechanism via token URL for device changes
- Server verifies payment with Stripe before restoring
