/**
 * AppContainer Component
 * Main app container - delegates routing to StepRenderer and modals to ModalsLayer
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialIcon from './MaterialIcon';
import Header from './Header';
import Footer from './Footer';
import StepProgress from './StepProgress';
import FloatingNavigation from './FloatingNavigation';
import ModalsLayer from './ModalsLayer';
import FaqJsonLd from './FaqJsonLd';
import SeoHead from './SeoHead';
import {
  useTranslationContext,
  useWizardNavigationContext,
  useThemeContext,
  useToastContext,
} from '../context/WizardProviders';
import { useFormStore } from '../stores/formStore';
import { useTemplateSelection, useFormValidation, validateStep } from '../hooks';
import ThankYouRoute from '../routes/ThankYouRoute';
import StepRenderer from './StepRenderer';
import { WizardProvider } from '../context/WizardContext';

const selectData = (s: ReturnType<typeof useFormStore.getState>) => s.data;
const selectUpdateData = (s: ReturnType<typeof useFormStore.getState>) => s.updateData;
const selectResetForm = (s: ReturnType<typeof useFormStore.getState>) => s.resetForm;

interface AppContainerProps {
  onDownloadPDF: (templateType?: string) => Promise<void>;
  onDownloadAllTemplates: () => Promise<void>;
  onGenerateText: () => void;
}

export const AppContainer: React.FC<AppContainerProps> = ({
  onDownloadPDF,
  onDownloadAllTemplates,
  onGenerateText,
}) => {
  const data = useFormStore(selectData);
  const updateData = useFormStore(selectUpdateData);
  const resetForm = useFormStore(selectResetForm);
  const { t, lang, setLang, isLoading: isTranslationLoading } = useTranslationContext();
  const navigate = useNavigate();
  const { step, animDir, goToStep } = useWizardNavigationContext();
  const { darkMode, setDarkMode, toggleTheme } = useThemeContext();
  const { showToast } = useToastContext();
  const { selectedTemplate, setSelectedTemplate, previewOpen, previewTemplate, closePreview } = useTemplateSelection();
  const { errors: validationErrors, isValid: isStepValid } = useFormValidation(data, step);

  const wrappedOnDownloadPDF = useCallback(() => onDownloadPDF(selectedTemplate), [onDownloadPDF, selectedTemplate]);

  const handleNext = () => {
    const { isValid } = validateStep(data, step);
    if (!isValid) {
      showToast(t?.validation?.fillRequired || 'Bitte füllen Sie die Pflichtfelder aus', 'error');
      return;
    }
    goToStep(step + 1);
  };

  useEffect(() => {
    if (step >= 1 && step <= 6) {
      const id = setTimeout(() => {
        const firstInput = document.querySelector<HTMLElement>('main input:not([type="hidden"]), main select, main textarea');
        firstInput?.focus({ preventScroll: false });
      }, 100);
      return () => clearTimeout(id);
    }
  }, [step]);

  const [legalPage, setLegalPage] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState(false);
  const [navigationVisible, setNavigationVisible] = useState(true);

  // A11y: keep <html lang="..."> in sync with the active UI language.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (step !== 4) setNavigationVisible(true);
  }, [step]);

  const wizardContextValue = useMemo(
    () => ({
      t,
      darkMode,
      step,
      animDir,
      validationErrors,
      onDownloadPDF: wrappedOnDownloadPDF,
      onDownloadAllTemplates,
      goToStep,
      setLang,
      setDarkMode,
      showToast,
      resetForm,
    }),
    [t, darkMode, step, animDir, validationErrors, wrappedOnDownloadPDF, onDownloadAllTemplates, goToStep, setLang, setDarkMode, showToast, resetForm]
  );

  if (isTranslationLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <MaterialIcon name="progress_activity" spin className="text-4xl text-inherit" />
        </div>
      </div>
    );
  }

  if (step === 7) {
    return (
      <>
        <SeoHead />
        <FaqJsonLd t={t} />
        <WizardProvider value={wizardContextValue}>
          <ThankYouRoute onFaqClick={() => setFaqOpen(true)} />
        </WizardProvider>
        <ModalsLayer
          t={t}
          darkMode={darkMode}
          faqOpen={faqOpen}
          setFaqOpen={setFaqOpen}
          legalPage={legalPage}
          setLegalPage={setLegalPage}
          previewOpen={previewOpen}
          previewTemplate={previewTemplate}
          closePreview={closePreview}
          data={data}
          showLayoutModals={false}
        />
      </>
    );
  }

  return (
    <>
      <SeoHead />
      <FaqJsonLd t={t} />
      <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleTheme}
          lang={lang}
          onLangChange={(v: string) => {
            updateData('lang', v);
            setLang(v);
            navigate(`/${v}/`, { replace: true });
          }}
          onLogoClick={() => goToStep(0)}
          t={t}
        />

        <main
          className={`w-full print:w-full print:max-w-none print:p-0 ${step >= 1 && step <= 6 ? 'pt-[72px]' : ''}`}
          aria-label={t?.ui?.mainLandmark ?? 'Pet application'}
          id="main-content"
        >
          {step >= 1 && step <= 6 && (
            <div className="sticky top-0 z-20 w-full pt-2 print:hidden bg-transparent backdrop-blur-[2px]">
              <StepProgress step={step} t={t} onStepClick={goToStep} />
              <div className="px-4 md:px-8 pt-1.5 pb-2 flex justify-center print:hidden">
                <div
                  className="inline-flex max-w-[min(100%,28rem)] items-center gap-1.5 px-2.5 py-1 rounded-full border text-center text-[11px] sm:text-xs font-semibold leading-tight bg-primary/10 text-[var(--primary)] border-primary/30"
                  role="status"
                >
                  <MaterialIcon name="shield_lock" className="text-sm shrink-0 text-inherit" aria-hidden />
                  <span>{t?.hero?.privacyDesc ?? 'Browser only.'}</span>
                </div>
              </div>
            </div>
          )}
          <div
            className={
              step === 0
                ? 'w-full px-4 md:px-8'
                : 'max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0'
            }
          >
            <StepRenderer
              step={step}
              wizardContextValue={wizardContextValue}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              showToast={showToast}
              onGenerateText={onGenerateText}
              onNavigationVisibilityChange={setNavigationVisible}
              handleNext={handleNext}
              darkMode={darkMode}
              t={t}
              onOpenFaq={() => setFaqOpen(true)}
            />
          </div>
        </main>

        <FloatingNavigation
          step={step}
          onPrev={() => goToStep(step - 1)}
          onNext={handleNext}
          t={t}
          darkMode={darkMode}
          canProceed={isStepValid}
          visible={navigationVisible}
        />

        {step === 0 && <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={() => setFaqOpen(true)} />}
      </div>

      <ModalsLayer
        t={t}
        darkMode={darkMode}
        faqOpen={faqOpen}
        setFaqOpen={setFaqOpen}
        legalPage={legalPage}
        setLegalPage={setLegalPage}
        previewOpen={previewOpen}
        previewTemplate={previewTemplate}
        closePreview={closePreview}
        data={data}
        showLayoutModals
      />
    </>
  );
};

export default AppContainer;
