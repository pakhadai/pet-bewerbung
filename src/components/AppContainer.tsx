/**
 * AppContainer Component
 * Main app container with routing logic, navigation, and modals
 * Handles step navigation and orchestrates step rendering
 */

import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Footer from './Footer';
import FaqModal from './FaqModal';
import StepProgress from './StepProgress';
import FloatingNavigation from './FloatingNavigation';
import CookieBanner, { COOKIE_CONSENT_KEY } from './CookieBanner';
import LegalPages from './LegalPages';
import ErrorBoundary from './ErrorBoundary';
import { X, Camera } from 'lucide-react';
import { useFormWizard, useToast, useTemplateSelection, useFormValidation, validateStep } from '../hooks';
import WizardRoute from '../routes/WizardRoute';
import HeroRoute from '../routes/HeroRoute';
import ThankYouRoute from '../routes/ThankYouRoute';
import { WizardProvider } from '../context/WizardContext';

// Lazy load heavy PDF components (only needed in Step 5)
const SwissDocument = lazy(() => import('./SwissDocument'));

interface AppContainerProps {
  onDownloadPDF: (templateType?: string) => Promise<void>;
  onDownloadAllTemplates: () => Promise<void>;
  onGenerateText: () => Promise<void>;
  onDonateMethod: (method: string) => Promise<void>;
  canGenerateAI?: boolean;
  remainingGenerations?: number;
}

export const AppContainer: React.FC<AppContainerProps> = ({
  onDownloadPDF,
  onDownloadAllTemplates,
  onGenerateText,
  onDonateMethod,
  canGenerateAI = true,
  remainingGenerations = 5,
}) => {
  // State management (single theme source from useFormWizard/useThemeContext)
  const { step, data, animDir, updateData, goToStep, t, lang, setLang, darkMode, setDarkMode, toggleTheme } = useFormWizard();
  const { showToast } = useToast();
  const { selectedTemplate, setSelectedTemplate, previewOpen, previewTemplate, closePreview } = useTemplateSelection();
  const { errors: validationErrors } = useFormValidation(data, step);

  // Wrap onDownloadPDF to inject selectedTemplate (user's chosen template)
  const wrappedOnDownloadPDF = useCallback(() => onDownloadPDF(selectedTemplate), [onDownloadPDF, selectedTemplate]);

  // Validated navigation: sync validation on current data (no validationRef/setTimeout)
  const handleNext = () => {
    if (document.activeElement?.blur) document.activeElement.blur();
    const { isValid } = validateStep(data, step);
    if (!isValid) {
      showToast(t?.validation?.fillRequired || 'Bitte füllen Sie die Pflichtfelder aus', 'error');
      return;
    }
    goToStep(step + 1);
  };

  // Local state for modals
  const [legalPage, setLegalPage] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState(false);
  const [navigationVisible, setNavigationVisible] = useState(true);
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'declined' | null>(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return consent as 'accepted' | 'declined' | null;
    } catch {
      return null;
    }
  });
  // Handle cookie consent change
  const handleCookieConsentChange = (consent: 'accepted' | 'declined') => {
    setCookieConsent(consent);
  };

  // Reset navigation visibility when step changes
  useEffect(() => {
    if (step !== 4) {
      setNavigationVisible(true);
    }
  }, [step]);

  // Convert darkMode to theme string
  const theme = darkMode ? 'dark' : 'light';

  // Memoize context value to prevent unnecessary re-renders of all WizardContext consumers
  const wizardContextValue = useMemo(
    () => ({
      data,
      updateData,
      t,
      darkMode,
      step,
      animDir,
      validationErrors,
      onDownloadPDF: wrappedOnDownloadPDF,
      onDownloadAllTemplates,
    }),
    [data, updateData, t, darkMode, step, animDir, validationErrors, wrappedOnDownloadPDF, onDownloadAllTemplates]
  );

  // GlobalStyles must be at app root so modals (FaqModal, LegalPages) have CSS vars & animations
  const appContent = step === 7 ? (
    <ThankYouRoute
      data={data}
      t={t}
      theme={theme}
      onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
      onLangChange={(v: string) => { updateData('lang', v); setLang(v as any); }}
      onLogoClick={() => goToStep(0)}
      onDownloadPDF={wrappedOnDownloadPDF}
      onCreateAnother={() => goToStep(0)}
      onPrev={() => goToStep(6)}
      showToast={showToast}
      onFaqClick={() => setFaqOpen(true)}
    />
  ) : (
    <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleTheme}
        lang={lang}
        onLangChange={(v: string) => { updateData('lang', v); setLang(v as any); }}
        onLogoClick={() => goToStep(0)}
        t={t}
      />

      <main className={`w-full print:w-full print:max-w-none print:p-0 ${step >= 1 && step <= 6 ? 'pt-24 md:pt-28' : ''}`}>
        {step >= 1 && step <= 6 && (
          <div className={`sticky top-0 z-20 w-full p-0 print:hidden border-b ${darkMode ? 'bg-gray-900 border-transparent' : 'bg-white border-transparent'}`}>
            <StepProgress step={step} t={t} darkMode={darkMode} onStepClick={goToStep} />
          </div>
        )}
        <div className={step === 0 ? "w-full" : "max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0"}>
          {step === 0 ? (
            <HeroRoute darkMode={darkMode} t={t} onStartClick={() => goToStep(1)} />
          ) : step >= 1 && step <= 6 ? (
            <WizardProvider value={wizardContextValue}>
              <WizardRoute
                step={step}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                showToast={showToast}
                onGenerateText={onGenerateText}
                onNavigationVisibilityChange={setNavigationVisible}
                canGenerateAI={canGenerateAI}
                remainingGenerations={remainingGenerations}
              />
            </WizardProvider>
          ) : null}
        </div>
      </main>

      {/* Floating Navigation Bar */}
      <FloatingNavigation
        step={step}
        onPrev={() => goToStep(step - 1)}
        onNext={handleNext}
        onDownloadPDF={wrappedOnDownloadPDF}
        t={t}
        darkMode={darkMode}
        canProceed={isStepValid}
        visible={navigationVisible}
      />

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 print:hidden">
          <div className="relative bg-transparent w-full h-full flex flex-col items-center justify-center" onClick={closePreview}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePreview();
              }}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X size={32} />
            </button>

            <div
              className="text-white mb-4 font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Camera size={18} /> {t.ui?.previewMode} — {previewTemplate}
            </div>

            <div
              className="w-full max-w-4xl h-full overflow-auto flex justify-center items-start pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 shadow-2xl">
                <ErrorBoundary
                  fallbackTitle="Preview Error"
                  fallbackMessage="Failed to render document preview. Please check your data and try again."
                  onReset={closePreview}
                >
                  <Suspense fallback={<div className="bg-white p-8 rounded-lg">Loading preview...</div>}>
                    <SwissDocument data={data} t={t} templateType={previewTemplate} />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 0 && <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={() => setFaqOpen(true)} />}

      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />

      <CookieBanner t={t} onOpenPrivacy={() => setLegalPage('privacy')} onConsentChange={handleCookieConsentChange} />
    </div>
  );

  return (
    <>
      <GlobalStyles />
      {appContent}
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} t={t} darkMode={darkMode} />
    </>
  );
};

export default AppContainer;
