# Hooks Refactoring Documentation

## Overview

The `useFormWizard.js` hook (652 lines) has been split into 8 separate, responsible TypeScript hooks for better maintainability and code organization.

## New Hook Structure

### Individual Hooks

#### 1. **`useDeviceId.ts`** (~80 lines)
Manages device identification for premium token binding.

```typescript
const { deviceId, generateNewId } = useDeviceId();
```

**Features:**
- Crypto-safe device ID generation
- localStorage persistence
- Fallback to weak random if crypto API unavailable

---

#### 2. **`useWizardNavigation.ts`** (~90 lines)
Manages wizard step navigation and animation.

```typescript
const {
  step,
  animDir,
  goToStep,
  nextStep,
  prevStep,
  setStep
} = useWizardNavigation();
```

**Features:**
- Step state management (0-6)
- Animation direction ('left' | 'right')
- localStorage persistence (steps 1-5 only)
- Auto-scroll to top on navigation

---

#### 3. **`useFormData.ts`** (~130 lines)
Manages form data with localStorage persistence.

```typescript
const {
  data,
  updateData,
  updateMultipleData,
  resetForm,
  saveData,
  loadSavedData,
  setData
} = useFormData('de');
```

**Features:**
- Auto-save to localStorage
- Handles large photos (>50KB warning)
- Merges with INITIAL_DATA on load
- Auto-clears generated text on language change

---

#### 4. **`usePremiumSession.ts`** (~200 lines)
Manages premium JWT session with device binding.

```typescript
const {
  isPremium,
  token,
  expiresAt,
  timeRemaining,
  premiumPrice,
  activate,
  clear,
  verifyToken,
  isTemplateAccessible,
  getTemplateInfo,
  checkPremiumExpiry
} = usePremiumSession();
```

**Features:**
- JWT token management
- Device-bound sessions (2 hours)
- Auto-expiry checking (every minute)
- Template access control
- Server-side token verification

---

#### 5. **`useAIGeneration.ts`** (~140 lines)
Manages AI generation limits and requests.

```typescript
const {
  generationCount,
  canGenerate,
  remainingGenerations,
  freeLimit,
  premiumLimit,
  incrementGeneration,
  resetGenerationCount,
  generatePetDescription
} = useAIGeneration(isPremium);
```

**Features:**
- Free users: 1 generation per day
- Premium users: 20 generations per day
- Daily reset based on date
- Server API integration
- Separate counters for free/premium

---

#### 6. **`useTranslation.ts`** (~60 lines)
Manages i18n translations.

```typescript
const { t, lang, setLang } = useTranslation();
```

**Features:**
- Auto-detects browser language
- Supports 6 languages: de, fr, it, rm, en, ua
- Maps 'uk' → 'ua' for Ukrainian
- Fallback to German

---

#### 7. **`useTheme.ts`** (~60 lines)
Manages light/dark theme preference.

```typescript
const { darkMode, toggleTheme, setDarkMode } = useTheme();
```

**Features:**
- localStorage persistence
- Toggle function
- Explicit setter

---

#### 8. **`useToast.ts`** (~70 lines)
Manages toast notifications.

```typescript
const { toast, showToast, hideToast } = useToast(5000);
```

**Features:**
- Auto-dismiss timer (default: 5000ms)
- Toast types: 'info' | 'success' | 'error' | 'warning'
- Cleanup on unmount

---

### Main Combined Hook

#### **`useFormWizard.ts`** (~140 lines)
Combines all sub-hooks into a single interface.

```typescript
const wizard = useFormWizard();
```

**Returns all sub-hook properties:**
- Wizard navigation: `step`, `animDir`, `goToStep`, `nextStep`, `prevStep`
- Form data: `data`, `updateData`, `updateMultipleData`, `resetForm`
- Premium: `isPremium`, `premiumToken`, `activatePremium`, `clearPremium`
- AI: `aiGenerations`, `canGenerate`, `generateDescription`
- Translation: `t`, `lang`, `setLang`
- Theme: `darkMode`, `toggleTheme`
- Toast: `toast`, `showToast`, `hideToast`
- Device: `deviceId`

---

### Legacy Hooks (Not Split)

The following hooks remain in `useFormWizard.js` for backward compatibility:

- **`useTemplateSelection()`** - Template preview/selection
- **`usePaymentFlow()`** - Donation/payment dialogs
- **`useScrollVisibility()`** - Scroll position detection
- **`useFormValidation()`** - Step-based form validation

---

## Migration Guide

### Before (Old Code)
```javascript
import { useFormWizard, usePremium, useAIGenerations } from './hooks';

const { step, data, t, updateData, goToStep } = useFormWizard();
const { isPremium, activatePremium } = usePremium();
const { canGenerate } = useAIGenerations(isPremium);
```

### After (New Code)
```typescript
// Option 1: Use combined hook (recommended)
import { useFormWizard } from './hooks';

const wizard = useFormWizard();
// Access: wizard.step, wizard.data, wizard.isPremium, etc.

// Option 2: Use individual hooks
import {
  useWizardNavigation,
  useFormData,
  usePremiumSession
} from './hooks';

const { step, goToStep } = useWizardNavigation();
const { data, updateData } = useFormData();
const { isPremium, activate } = usePremiumSession();
```

### Backward Compatibility

The old import style **still works** thanks to re-exports:

```javascript
import { useFormWizard, usePremium, useAIGenerations } from './hooks';
```

This is equivalent to:
```typescript
import { useFormWizard, usePremiumSession as usePremium, useAIGeneration as useAIGenerations } from './hooks';
```

---

## Benefits of Refactoring

1. **Separation of Concerns**: Each hook has a single responsibility
2. **TypeScript Support**: Full type safety with JSDoc comments
3. **Easier Testing**: Individual hooks can be tested in isolation
4. **Better Tree-Shaking**: Import only what you need
5. **Code Reusability**: Hooks can be used independently
6. **Improved Maintainability**: Smaller files, clearer structure
7. **Backward Compatible**: Existing code continues to work

---

## File Structure

```
src/hooks/
├── index.ts                    # Central export point
├── useFormWizard.ts            # Main combined hook (new)
├── useFormWizard.js            # Legacy compatibility layer
├── useFormWizard.legacy.js     # Original file (preserved)
├── useWizardNavigation.ts      # Step navigation
├── useFormData.ts              # Form state
├── usePremiumSession.ts        # Premium JWT
├── useAIGeneration.ts          # AI limits
├── useTranslation.ts           # i18n
├── useTheme.ts                 # Dark mode
├── useToast.ts                 # Notifications
├── useDeviceId.ts              # Device ID
└── README.md                   # This file
```

---

## Notes

- All localStorage keys remain unchanged for backward compatibility
- TypeScript strict mode enabled with full type safety
- Error handling preserved from original implementation
- Development logging (`import.meta.env.DEV`) maintained
- No changes to business logic - pure refactoring

---

## Testing

The refactoring has been tested and verified:

✅ TypeScript compilation successful
✅ Dev server starts without errors
✅ All imports resolve correctly
✅ Backward compatibility maintained
✅ localStorage keys unchanged

---

## Future Improvements

Potential enhancements (not implemented yet):

1. Add React Context for global state sharing
2. Add unit tests for each hook
3. Add Storybook stories for hook documentation
4. Consider using Zustand or Redux for complex state
5. Add performance monitoring with React DevTools Profiler
