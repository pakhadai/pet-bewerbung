# Hooks Architecture

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     useFormWizard.ts                        │
│                   (Main Combined Hook)                      │
│                                                             │
│  Combines all sub-hooks into single interface              │
│  Provides backward-compatible API                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Imports & Combines
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│   Core Hooks     │                  │  Feature Hooks   │
│                  │                  │                  │
├──────────────────┤                  ├──────────────────┤
│ useDeviceId      │                  │ usePremiumSession│
│ useWizardNav     │                  │ useAIGeneration  │
│ useFormData      │                  │ useTranslation   │
│ useTheme         │                  │ useToast         │
└──────────────────┘                  └──────────────────┘
```

---

## Dependency Graph

```
useFormWizard (Main)
├── useWizardNavigation
│   └── localStorage (step)
│
├── useFormData
│   ├── localStorage (form data)
│   └── useTranslation (lang)
│
├── usePremiumSession
│   ├── localStorage (token, expiry)
│   └── useDeviceId (device binding)
│
├── useAIGeneration
│   ├── localStorage (generations)
│   └── isPremium (from usePremiumSession)
│
├── useTranslation
│   └── TRANSLATIONS (constants)
│
├── useTheme
│   └── localStorage (theme)
│
├── useToast
│   └── React state (no persistence)
│
└── useDeviceId
    └── localStorage (device-id)
```

---

## Data Flow

### Form Submission Flow
```
User Input
    │
    ▼
useFormData.updateData()
    │
    ▼
localStorage.setItem('pet-bewerbung-form-data', data)
    │
    ▼
Auto-save on every change
```

### Premium Activation Flow
```
Payment Success
    │
    ▼
useDeviceId.deviceId
    │
    ▼
usePremiumSession.activate(paymentId, deviceId)
    │
    ▼
API: /api/activate-premium
    │
    ▼
JWT Token Received
    │
    ▼
localStorage.setItem('pet-bewerbung-premium-token', token)
    │
    ▼
isPremium = true
```

### AI Generation Flow
```
User Clicks Generate
    │
    ▼
useAIGeneration.canGenerate check
    │
    ├─ Free user: 1 generation per day
    └─ Premium user: 20 generations per day
    │
    ▼
useAIGeneration.generatePetDescription(data, isPremium)
    │
    ▼
API: /api/generate-pet-description
    │
    ▼
useAIGeneration.incrementGeneration()
    │
    ▼
localStorage.setItem('pet-bewerbung-ai-generations', count)
```

### Navigation Flow
```
User Clicks Next
    │
    ▼
useWizardNavigation.nextStep()
    │
    ▼
goToStep(step + 1)
    │
    ├─ setAnimDir('right')
    ├─ setStep(newStep)
    └─ window.scrollTo({ top: 0 })
    │
    ▼
localStorage.setItem('pet-bewerbung-step', step)
```

---

## Hook Responsibilities

### Core Hooks (Low-Level)

#### useDeviceId
- **Purpose**: Unique device identification
- **Storage**: localStorage
- **Key**: `pet-bewerbung-device-id`
- **Dependencies**: None
- **Used By**: usePremiumSession

#### useWizardNavigation
- **Purpose**: Step navigation and animation
- **Storage**: localStorage
- **Key**: `pet-bewerbung-step`
- **Dependencies**: None
- **Used By**: useFormWizard

#### useFormData
- **Purpose**: Form state management
- **Storage**: localStorage
- **Key**: `pet-bewerbung-form-data`
- **Dependencies**: useTranslation (for language)
- **Used By**: useFormWizard

#### useTheme
- **Purpose**: Dark mode toggle
- **Storage**: localStorage
- **Key**: `pet-bewerbung-theme`
- **Dependencies**: None
- **Used By**: useFormWizard

#### useToast
- **Purpose**: Toast notifications
- **Storage**: React state (no persistence)
- **Dependencies**: None
- **Used By**: useFormWizard

---

### Feature Hooks (High-Level)

#### usePremiumSession
- **Purpose**: Premium JWT session management
- **Storage**: localStorage
- **Keys**:
  - `pet-bewerbung-premium-token`
  - `pet-bewerbung-premium-expiry`
- **Dependencies**: useDeviceId
- **Used By**: useFormWizard, useAIGeneration

#### useAIGeneration
- **Purpose**: AI generation limits and API calls
- **Storage**: localStorage
- **Keys**:
  - `pet-bewerbung-ai-generations`
  - `pet-bewerbung-premium-ai-generations`
- **Dependencies**: isPremium (from usePremiumSession)
- **Used By**: useFormWizard

#### useTranslation
- **Purpose**: i18n translations
- **Storage**: None (uses TRANSLATIONS constant)
- **Dependencies**: TRANSLATIONS from constants
- **Used By**: useFormWizard, useFormData

---

## localStorage Keys Reference

| Key | Hook | Type | Reset Condition |
|-----|------|------|-----------------|
| `pet-bewerbung-device-id` | useDeviceId | string (UUID) | Never (persistent) |
| `pet-bewerbung-step` | useWizardNavigation | number (0-6) | On step 0 or 6 |
| `pet-bewerbung-form-data` | useFormData | JSON object | Manual reset only |
| `pet-bewerbung-premium-token` | usePremiumSession | string (JWT) | On expiry |
| `pet-bewerbung-premium-expiry` | usePremiumSession | number (timestamp) | On expiry |
| `pet-bewerbung-ai-generations` | useAIGeneration | JSON {count, date} | Daily (date change) |
| `pet-bewerbung-premium-ai-generations` | useAIGeneration | JSON {count, date} | Daily (date change) |
| `pet-bewerbung-theme` | useTheme | string ('dark' \| 'light') | Never |

---

## API Endpoints Used

| Endpoint | Hook | Method | Purpose |
|----------|------|--------|---------|
| `/api/activate-premium` | usePremiumSession | POST | Activate premium after payment |
| `/api/verify-premium` | usePremiumSession | POST | Verify JWT token validity |
| `/api/generate-pet-description` | useAIGeneration | POST | Generate AI description |
| `/api/improve-text` | (External) | POST | Improve existing text (Premium) |

---

## State Updates Timeline

### Initial Load
```
1. useDeviceId         → Load/generate device ID
2. useWizardNavigation → Load saved step (or 0)
3. useFormData         → Load saved form data
4. usePremiumSession   → Load token & check expiry
5. useAIGeneration     → Load generation count
6. useTranslation      → Detect browser language
7. useTheme            → Load theme preference
8. useToast            → Initialize (no load)
```

### During Usage
```
User types → useFormData.updateData() → Auto-save to localStorage
User navigates → useWizardNavigation.goToStep() → Save step to localStorage
User generates AI → useAIGeneration.increment() → Save count to localStorage
User toggles theme → useTheme.toggleTheme() → Save to localStorage
User activates premium → usePremiumSession.activate() → Save token to localStorage
```

---

## Error Handling Strategy

### localStorage Failures
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  // Ignore silently in production
  // Log warning in development
  if (import.meta.env.DEV) {
    console.warn('localStorage error:', e);
  }
}
```

### API Failures
```javascript
try {
  const response = await fetch(endpoint, options);
  if (!response.ok) throw new Error(data.error);
  return data;
} catch (e) {
  console.error('API error:', e);
  throw e; // Let caller handle
}
```

### Crypto API Fallback
```javascript
// Try crypto.randomUUID (best)
if (crypto && crypto.randomUUID) {
  id = crypto.randomUUID();
}
// Fallback to crypto.getRandomValues (good)
else if (crypto && crypto.getRandomValues) {
  id = generateFromRandomBytes();
}
// Last resort: Math.random (weak, but works)
else {
  console.warn('Using weak random');
  id = generateFromMathRandom();
}
```

---

## Performance Considerations

### Memoization
- All hooks use `useMemo` and `useCallback` for expensive operations
- Prevents unnecessary re-renders
- Optimizes bundle size with tree-shaking

### localStorage Throttling
- No explicit throttling (React batches state updates)
- Each hook manages its own localStorage key
- No conflicts or race conditions

### API Rate Limiting
- Enforced server-side (Redis)
- Client-side tracking in useAIGeneration
- Premium users bypass limits

---

## Testing Strategy

### Unit Tests (Recommended)
```javascript
// Example test for useDeviceId
describe('useDeviceId', () => {
  it('generates a stable device ID', () => {
    const { result } = renderHook(() => useDeviceId());
    const id1 = result.current.deviceId;

    // Re-render
    const { result: result2 } = renderHook(() => useDeviceId());
    const id2 = result2.current.deviceId;

    expect(id1).toBe(id2);
  });
});
```

### Integration Tests (Recommended)
```javascript
// Example test for useFormWizard
describe('useFormWizard', () => {
  it('combines all hooks correctly', () => {
    const { result } = renderHook(() => useFormWizard());

    expect(result.current.step).toBeDefined();
    expect(result.current.data).toBeDefined();
    expect(result.current.isPremium).toBeDefined();
    expect(result.current.t).toBeDefined();
  });
});
```

---

## Migration Checklist

### For Developers

- [ ] Read `README.md` in hooks folder
- [ ] Review this architecture document
- [ ] Understand individual hook responsibilities
- [ ] Test combined hook usage
- [ ] Test individual hook usage
- [ ] Verify localStorage keys unchanged
- [ ] Check TypeScript types work
- [ ] Run dev server and test flows
- [ ] Test premium activation
- [ ] Test AI generation
- [ ] Test navigation
- [ ] Verify backward compatibility

### For QA

- [ ] Test all user flows end-to-end
- [ ] Verify localStorage persistence
- [ ] Test premium activation
- [ ] Test AI generation limits
- [ ] Test form data saving
- [ ] Test navigation between steps
- [ ] Test theme toggle
- [ ] Test language switching
- [ ] Test toast notifications
- [ ] Verify no console errors

---

## Questions & Answers

### Q: Why split into so many files?
**A**: Single Responsibility Principle. Each hook has one clear purpose, making code easier to understand, test, and maintain.

### Q: Can I use individual hooks separately?
**A**: Yes! Each hook is self-contained. Import only what you need.

### Q: Will this break existing code?
**A**: No. The main `useFormWizard()` hook provides the same API as before.

### Q: What about performance?
**A**: Performance is the same or better. Tree-shaking can remove unused hooks, and memoization prevents unnecessary re-renders.

### Q: Why TypeScript?
**A**: Type safety, better IntelliSense, fewer runtime errors, and clearer documentation.

### Q: Can I go back to the old version?
**A**: Yes. The original file is preserved as `useFormWizard.legacy.js`.

---

## Contributing

When modifying hooks:

1. **Keep hooks focused**: One responsibility per hook
2. **Preserve localStorage keys**: Don't change existing keys
3. **Maintain backward compatibility**: Don't break existing API
4. **Add TypeScript types**: Export interfaces
5. **Write JSDoc comments**: Document parameters and returns
6. **Handle errors gracefully**: Use try-catch with fallbacks
7. **Test thoroughly**: Unit tests + integration tests
8. **Update documentation**: Keep README.md current

---

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JWT Introduction](https://jwt.io/introduction)
