# App.tsx Refactoring Guide

## Quick Overview

The monolithic `src/App.tsx` (1,161 lines) has been refactored into a modular architecture:

| File | Size | Purpose |
|------|------|---------|
| `src/App.tsx` | 30 lines | Entry point composition |
| `src/components/AppProviders.tsx` | 30 lines | Error boundary |
| `src/components/AppContent.tsx` | 450 lines | Business logic |
| `src/components/AppContainer.tsx` | 500 lines | UI orchestration |
| `src/routes/WizardRoute.tsx` | 100 lines | Steps 1-6 |
| `src/routes/HeroRoute.tsx` | 30 lines | Step 0 landing |
| `src/routes/ThankYouRoute.tsx` | 50 lines | Step 7 thank you |

**Total**: 9 files, ~1,200 lines (same as original, better organized)

## File Structure

```
src/
├── App.tsx                      # Entry point
├── components/
│   ├── AppProviders.tsx        # Setup
│   ├── AppContainer.tsx        # UI routing
│   ├── AppContent.tsx          # Business logic
│   └── ... (other components)
└── routes/                      # Step rendering
    ├── WizardRoute.tsx
    ├── HeroRoute.tsx
    └── ThankYouRoute.tsx
```

## Understanding the Data Flow

### Entry Point: App.tsx
```typescript
export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
```
- Minimal composition layer
- Wraps with error boundary
- Delegates all logic to children

### Setup Layer: AppProviders.tsx
```typescript
export const AppProviders: React.FC = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
```
- Error handling
- Could add global providers if needed

### Business Logic: AppContent.tsx

Contains functions for:
- **PDF Generation**: `handleDownloadPDF()`, `generatePdfBlob()`, `handleDownloadAllTemplates()`
- **AI Text**: `generateText()`, `generateFallbackText()`
- **Payments**: `handleDonateMethod()`
- **Utilities**: Data conversion, logo loading, translation building

```typescript
// Example: Generate AI text
const generateText = async () => {
  if (!canGenerateAI) {
    // Show error and fallback
  }
  // Call API
  // Update form data
  // Show toast
};
```

### UI Orchestration: AppContainer.tsx

Manages:
- Step-based routing (0-7)
- All modal states
- Theme and cookie management
- Navigation components
- URL parameter handling

```typescript
// Example: Handle step navigation
<WizardRoute
  step={step}
  animDir={animDir}
  data={data}
  // ... other props
/>
```

### Route Components

#### WizardRoute.tsx - Steps 1-6
```typescript
switch (step) {
  case 1: return <Step1Details ... />;
  case 2: return <Step2HealthInsurance ... />;
  case 3: return <Step3Description ... />;
  case 4: return <Step4Photo ... />;
  case 5: return <Step5TemplateSelect ... />;
  case 6: return <Step5Preview ... />;
}
```

#### HeroRoute.tsx - Step 0
```typescript
return (
  <Hero darkMode={darkMode} t={t} onStartClick={onStartClick} />
);
```

#### ThankYouRoute.tsx - Step 7
```typescript
return (
  <Step6ThankYou
    // Props for thank you page
  />
);
```

## Adding New Features

### Adding a New PDF Feature

1. **Add function in AppContent.tsx**:
```typescript
const handleNewPdfFeature = async () => {
  // Implementation
};
```

2. **Pass to AppContainer**:
```typescript
<AppContainer
  onNewPdfFeature={handleNewPdfFeature}
  // ... other props
/>
```

3. **Use in AppContainer**:
```typescript
<SomeComponent
  onFeatureClick={onNewPdfFeature}
/>
```

### Adding a New Step

1. **Create step component**:
```typescript
// src/components/steps/StepX.tsx
export const StepX = ({ data, updateData, t, ... }) => {
  return <div>Step content</div>;
};
```

2. **Add to WizardRoute.tsx**:
```typescript
case 9:
  return <StepX data={data} updateData={updateData} ... />;
```

3. **Update step navigation**:
```typescript
// In AppContainer or wherever step logic lives
const maxStep = 9;
```

### Adding a New Modal

1. **Create modal component**:
```typescript
// src/components/MyModal.tsx
export const MyModal = ({ open, onClose, ... }) => {
  return <Dialog open={open}>{/* content */}</Dialog>;
};
```

2. **Add state in AppContainer.tsx**:
```typescript
const [myModalOpen, setMyModalOpen] = useState(false);
```

3. **Render modal**:
```typescript
<MyModal
  open={myModalOpen}
  onClose={() => setMyModalOpen(false)}
/>
```

## Debugging Tips

### Finding Business Logic
- **PDF**: Look in `AppContent.tsx` for `handle*PDF*` functions
- **AI**: Look in `AppContent.tsx` for `generateText*` functions
- **Payments**: Look in `AppContent.tsx` for `handleDonate*` functions
- **UI State**: Look in `AppContainer.tsx` for modals and theme

### Tracing a Feature
1. Start from UI component
2. Find onClick handler
3. Check AppContainer or AppContent for handler function
4. Look at hook calls (usePremium, useToast, etc.)

### Common Hooks
```typescript
// Form and wizard state
const { step, data, updateData, goToStep, t } = useFormWizard();

// Premium features
const { isPremium, activatePremium } = usePremium();

// Toast notifications
const { showToast } = useToast();

// Template selection
const { selectedTemplate, setSelectedTemplate } = useTemplateSelection();

// Donation/payment state
const { donationAmount, setDonationAmount } = usePaymentFlow();
```

## Performance Optimization

### Current Structure
- Single entry point (App.tsx)
- All UI in AppContainer
- All logic in AppContent
- Routes organized in `/routes/`

### Optimization Opportunities

1. **Lazy load route components** (if file sizes grow):
```typescript
const WizardRoute = lazy(() => import('../routes/WizardRoute'));
```

2. **Memoize expensive components**:
```typescript
export const WizardRoute = memo(WizardRouteComponent);
```

3. **Extract hooks for heavy logic**:
```typescript
// src/hooks/usePDFGeneration.ts
export const usePDFGeneration = () => {
  // Moved from AppContent
};
```

## Testing

### Test AppContent (Business Logic)
```typescript
describe('AppContent', () => {
  it('should generate AI text', async () => {
    // Test generateText function
  });

  it('should download PDF', async () => {
    // Test handleDownloadPDF
  });
});
```

### Test AppContainer (UI & Routing)
```typescript
describe('AppContainer', () => {
  it('should render hero on step 0', () => {
    // Render with step={0}
  });

  it('should show wizard on steps 1-6', () => {
    // Render with step={1..6}
  });
});
```

### Test Routes
```typescript
describe('WizardRoute', () => {
  it('should render step 1', () => {
    // Render with step={1}
  });
});
```

## Rollback Instructions

If you need to revert to the original monolithic structure:

```bash
# Option 1: Use backup file
cp src/App.legacy.tsx src/App.tsx

# Option 2: Revert git commit
git revert c4caeb1

# Option 3: Restore specific version
git checkout HEAD~1 src/App.tsx
rm src/App.legacy.tsx src/components/AppContainer.tsx src/components/AppContent.tsx src/components/AppProviders.tsx
rm -rf src/routes/
```

## Common Issues

### Issue: "Cannot find module './routes/WizardRoute'"
**Solution**: Check that file path is correct: `src/routes/WizardRoute.tsx`

### Issue: "Hook must be called inside component"
**Solution**: Ensure hooks are only called in components, not in utility functions.

### Issue: "Type mismatch in route props"
**Solution**: Check that all required props are passed to route components.

### Issue: State not updating
**Solution**: Ensure you're calling `updateData()` not updating state directly.

## Quick Reference

### Key Files and Their Responsibilities

| File | Contains | Examples |
|------|----------|----------|
| `AppContent.tsx` | Business functions | `generateText()`, `handleDownloadPDF()` |
| `AppContainer.tsx` | UI state & routing | Modal states, step navigation |
| `WizardRoute.tsx` | Step rendering | Step 1-6 components |
| `HeroRoute.tsx` | Landing page | Hero + Steps overview |
| `ThankYouRoute.tsx` | Thank you page | Donation + downloads |

### Common Imports

```typescript
// From components
import AppContainer from './components/AppContainer';
import WizardRoute from '../routes/WizardRoute';

// From hooks
import { useFormWizard, useToast, usePremium } from './hooks';

// From constants
import { PAYMENT_SUCCESS_BEHAVIOR, TEMPLATE_OPTIONS } from './constants';
```

## Summary

The refactoring provides:
✅ Clear separation of concerns
✅ Easier to locate functionality
✅ Better for team development
✅ Simpler to test
✅ Easier to add features
✅ Same functionality as before
✅ No breaking changes

Enjoy the improved code organization!
