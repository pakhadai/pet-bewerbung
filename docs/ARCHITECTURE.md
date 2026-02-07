# Application Architecture After Refactoring

## Overview

The application has been refactored from a single monolithic `src/App.tsx` (1,161 lines) into a clean, modular architecture following React best practices.

## File Structure

```
src/
├── App.tsx                          # Entry point (30 lines)
├── App.legacy.tsx                   # Original file backup (44 KB)
├── components/
│   ├── AppProviders.tsx             # Error boundary wrapper
│   ├── AppContainer.tsx             # Main UI orchestration
│   ├── AppContent.tsx               # Business logic
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Steps.tsx
│   ├── SwissDocument.jsx
│   └── ... (other components)
├── routes/
│   ├── index.ts                     # Route exports
│   ├── WizardRoute.tsx              # Steps 1-6
│   ├── HeroRoute.tsx                # Step 0 (landing)
│   └── ThankYouRoute.tsx            # Step 7 (thank you)
├── hooks/
│   ├── useFormWizard.ts             # Main wizard logic
│   ├── usePremium.ts
│   ├── useToast.ts
│   ├── usePaymentFlow.ts
│   └── ... (other hooks)
├── contexts/
│   ├── FormContext.tsx
│   ├── ThemeContext.tsx
│   └── TranslationContext.tsx
└── utils/
    ├── imageCompression.ts
    ├── qrCode.ts
    └── ... (other utilities)
```

## Component Hierarchy

```
App (composition layer)
└── AppProviders (setup layer)
    └── AppContent (business logic layer)
        └── AppContainer (UI orchestration layer)
            ├── HeroRoute (Step 0)
            ├── WizardRoute (Steps 1-6)
            │   ├── Step1Details
            │   ├── Step2HealthInsurance
            │   ├── Step3Description
            │   ├── Step4Photo
            │   ├── Step5TemplateSelect
            │   └── Step5Preview
            ├── ThankYouRoute (Step 7)
            └── Modals
                ├── FaqModal
                ├── PaymentModal
                ├── DonateModal
                ├── DocumentEditor
                └── Preview
```

## Module Responsibilities

### App.tsx
- **Size**: 30 lines
- **Responsibility**: Composition only
- **Pattern**: Factory pattern
- **Content**:
  ```typescript
  export default function App() {
    return (
      <AppProviders>
        <AppContent />
      </AppProviders>
    );
  }
  ```

### AppProviders.tsx
- **Size**: 30 lines
- **Responsibility**: Setup and error handling
- **Pattern**: Provider pattern
- **Content**:
  - Error boundary wrapper
  - Minimal setup (contexts via hooks)

### AppContent.tsx
- **Size**: 450 lines
- **Responsibility**: All business logic
- **Pattern**: Orchestrator pattern
- **Functions**:
  - `generateText()` - AI text generation
  - `generateFallbackText()` - Template-based fallback
  - `handleDownloadPDF()` - Single PDF download
  - `generatePdfBlob()` - PDF blob generation
  - `handleDownloadAllTemplates()` - ZIP export
  - `handleDonateMethod()` - Payment processing
  - `blobUrlToDataUrl()` - Data conversion
  - `fetchLogoAsDataUrl()` - Asset loading
  - `buildPdfTranslations()` - Translation building
- **Uses**:
  - `useFormWizard()` - Form state
  - `useToast()` - Toast notifications
  - `usePremium()` - Premium features
  - `useAIGenerations()` - AI limits
  - `usePaymentFlow()` - Payment state

### AppContainer.tsx
- **Size**: 500 lines
- **Responsibility**: UI orchestration and routing
- **Pattern**: Container pattern
- **Key Sections**:
  - **State Management**:
    - Dark mode
    - Modals (FAQ, Payment, Donate, Builder, Preview)
    - Legal pages
    - Cookie consent
    - Payment success
  - **Routing**:
    - Step-based routing (0-7)
    - Hero (step 0)
    - Wizard (steps 1-6)
    - Thank you (step 7)
  - **Navigation**:
    - Header
    - Footer
    - StepProgress
    - FloatingNavigation
  - **Features**:
    - URL parameter handling
    - Payment success detection
    - Theme persistence
    - Cookie management

### Routes

#### WizardRoute.tsx
- **Size**: 100 lines
- **Steps**: 1-6
- **Components**:
  - Step1Details - Owner & pet info
  - Step2HealthInsurance - Health & insurance data
  - Step3Description - AI description generation
  - Step4Photo - Photo upload & cropping
  - Step5TemplateSelect - Template selection
  - Step5Preview - Preview & download

#### HeroRoute.tsx
- **Size**: 30 lines
- **Content**: Landing page hero section
- **Components**:
  - Hero section with CTA
  - Features overview (Steps)

#### ThankYouRoute.tsx
- **Size**: 50 lines
- **Content**: Thank you page
- **Components**:
  - Donation options
  - Download links
  - Create another CV button

## Data Flow

### User Interaction Flow

```
User Action
  ↓
Hook (useFormWizard, etc.)
  ↓
State Update
  ↓
AppContainer Re-render
  ↓
Step Component Re-render
  ↓
DOM Update
```

### Payment Flow

```
User clicks "Buy Premium"
  ↓
handleBuyPremiumClick() [AppContainer]
  ↓
Check cookie consent
  ↓
Open PaymentModal
  ↓
User completes payment
  ↓
handlePremiumPaymentSuccess() [AppContainer]
  ↓
activatePremium() [usePremium hook]
  ↓
JWT token stored + features unlocked
```

### PDF Generation Flow

```
User clicks "Download PDF"
  ↓
handleDownloadPDF() [AppContent]
  ↓
Prepare PDF data:
  - Compress images
  - Convert formats
  - Build translations
  - Fetch logo
  - Generate QR code
  ↓
Import PDF renderer
  ↓
Generate PDF blob
  ↓
Create download link
  ↓
Trigger browser download
```

### AI Text Generation Flow

```
User clicks "Generate"
  ↓
generateText() [AppContent]
  ↓
Check AI limit (free: 3/day, premium: unlimited)
  ↓
Send pet data to API
  ↓
Receive generated text
  ↓
Update form data
  ↓
Show success toast
  ↓
Fallback to template if error
```

## State Management

### Form State (via useFormWizard)
```javascript
{
  step: number,
  data: PetData,
  animDir: 'left' | 'right',
  t: translations,
  updateData: (key, value) => void,
  goToStep: (step) => void
}
```

### UI State (in AppContainer)
```javascript
{
  darkMode: boolean,
  legalPage: string | null,
  faqOpen: boolean,
  showPaymentSuccess: boolean,
  paymentSessionId: string | null,
  navigationVisible: boolean,
  cookieConsent: 'accepted' | 'declined' | null,
  forceCookieBanner: boolean,
  premiumPaymentOpen: boolean,
  builderOpen: boolean
}
```

### Derived State (computed)
```javascript
{
  theme: 'light' | 'dark',
  appContent: ReactNode,
  isPremium: boolean,
  premiumTimeRemaining: number,
  selectedTemplate: string,
  showPreview: boolean
}
```

## Benefits of This Architecture

### 1. Separation of Concerns
- Each file has a single responsibility
- Clear boundaries between layers
- Easy to understand each component's role

### 2. Maintainability
- No 1000+ line files
- Related code grouped together
- Easy to locate functionality
- Clear import paths

### 3. Testability
- Business logic isolated (AppContent)
- UI logic isolated (AppContainer)
- Routes testable independently
- Easy to mock dependencies

### 4. Scalability
- Easy to add new steps (just add new route)
- Easy to add new business logic (add function to AppContent)
- Easy to refactor further if needed

### 5. Code Reusability
- Routes can be composed differently
- AppContent functions can be extracted to utilities
- Clear interfaces between components

### 6. Developer Experience
- Easier onboarding for new developers
- Clear file organization
- Self-documenting code structure
- IDE navigation is faster

## Performance Considerations

### Code Splitting
- Routes can be lazy-loaded:
  ```typescript
  const WizardRoute = lazy(() => import('../routes/WizardRoute'));
  ```

### Memoization Opportunities
- Step components: `memo(StepComponent)`
- Modal components: `memo(Modal)`
- Preview: `memo(PreviewComponent)`

### Bundle Size
- Original: ~44 KB in single file
- Refactored: ~44 KB split across 9 files
- Same size, better organization
- Can optimize further with tree-shaking

## Migration and Rollback

### To Use New Architecture
- App is already using new structure
- Everything works as before
- No migration needed

### To Rollback to Original
```bash
# Option 1: Restore from backup
cp src/App.legacy.tsx src/App.tsx

# Option 2: Use git history
git revert c4caeb1

# Option 3: Restore from git
git checkout HEAD~1 src/App.tsx
```

## Future Improvements

1. **Extract Business Logic to Services**
   ```typescript
   src/services/
   ├── pdfService.ts
   ├── aiService.ts
   ├── paymentService.ts
   └── storageService.ts
   ```

2. **Add Custom Hooks for Modal Management**
   ```typescript
   src/hooks/
   ├── useModal.ts
   ├── usePDFGeneration.ts
   └── usePayment.ts
   ```

3. **Add State Management Library** (if needed)
   ```typescript
   src/store/
   ├── formSlice.ts
   ├── uiSlice.ts
   └── premiumSlice.ts
   ```

4. **Add Error Boundary per Route**
   ```typescript
   src/routes/
   ├── WizardRoute/
   │   ├── index.tsx
   │   └── ErrorBoundary.tsx
   ```

5. **Extract Constants**
   ```typescript
   src/constants/
   ├── routes.ts
   ├── modals.ts
   └── states.ts
   ```

## Conclusion

The refactored architecture maintains all functionality while providing:
- ✅ Better code organization
- ✅ Easier maintenance
- ✅ Clearer responsibilities
- ✅ Improved developer experience
- ✅ Foundation for future scalability

All changes are backward compatible with zero breaking changes.
