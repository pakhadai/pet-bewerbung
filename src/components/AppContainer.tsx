/**
 * AppContainer Component
 * Main app container with routing logic, navigation, and modals
 * Handles step navigation and orchestrates step rendering
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import FaqModal from './FaqModal';
import StepProgress from './StepProgress';
import FloatingNavigation from './FloatingNavigation';
import CookieBanner, { COOKIE_CONSENT_KEY } from './CookieBanner';
import LegalPages from './LegalPages';
import ErrorBoundary from './ErrorBoundary';
import { X, Camera } from 'lucide-react';
import { useFormWizard, useToast, usePremium, useTemplateSelection, useFormValidation } from '../hooks';
import WizardRoute from '../routes/WizardRoute';
import HeroRoute from '../routes/HeroRoute';
import ThankYouRoute from '../routes/ThankYouRoute';

// Lazy load heavy PDF components (only needed in Step 5)
const SwissDocument = lazy(() => import('./SwissDocument'));

interface AppContainerProps {
  onDownloadPDF: () => Promise<void>;
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
  // State management
  const { step, data, animDir, updateData, goToStep, t, lang, setLang } = useFormWizard();
  const { showToast } = useToast();
  const { isPremium, getTemplateInfo } = usePremium();
  const { selectedTemplate, setSelectedTemplate, previewOpen, previewTemplate, closePreview } = useTemplateSelection();
  const { errors: validationErrors, isValid: isStepValid } = useFormValidation(data, step);

  // Validated navigation: block forward if current step has validation errors
  const handleNext = () => {
    if (!isStepValid) {
      showToast(t?.validation?.fillRequired || 'Bitte füllen Sie die Pflichtfelder aus', 'error');
      return;
    }
    goToStep(step + 1);
  };

  // Local state for modals and theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet-bewerbung-theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

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
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('pet-bewerbung-theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

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

  // Main app content
  const appContent = step === 7 ? (
    <ThankYouRoute
      data={data}
      t={t}
      theme={theme}
      onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
      onLangChange={(v: string) => { updateData('lang', v); setLang(v as any); }}
      onLogoClick={() => goToStep(0)}
      onDownloadPDF={onDownloadPDF}
      onCreateAnother={() => goToStep(0)}
      onPrev={() => goToStep(6)}
      showToast={showToast}
      onFaqClick={() => setFaqOpen(true)}
    />
  ) : (
    <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
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
            <WizardRoute
              step={step}
              animDir={animDir}
              data={data}
              updateData={updateData}
              t={t}
              darkMode={darkMode}
              isPremium={isPremium}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              showToast={showToast}
              onGenerateText={onGenerateText}
              onDownloadPDF={onDownloadPDF}
              getTemplateInfo={getTemplateInfo}
              onDownloadAllTemplates={onDownloadAllTemplates}
              onNavigationVisibilityChange={setNavigationVisible}
              validationErrors={validationErrors}
              canGenerateAI={canGenerateAI}
              remainingGenerations={remainingGenerations}
            />
          ) : null}
        </div>
      </main>

      {/* Floating Navigation Bar */}
      <FloatingNavigation
        step={step}
        onPrev={() => goToStep(step - 1)}
        onNext={handleNext}
        onDownloadPDF={onDownloadPDF}
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
      {appContent}
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} t={t} darkMode={darkMode} />
    </>
  );
};

export default AppContainer;
