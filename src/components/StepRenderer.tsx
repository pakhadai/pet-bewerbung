/**
 * StepRenderer - Renders main content based on step
 * Routes: Hero (0), Wizard (1-6). Step 7 (ThankYou) is handled by AppContainer.
 */
import React from 'react';
import HeroRoute from '../routes/HeroRoute';
import WizardRoute from '../routes/WizardRoute';
import { WizardProvider } from '../context/WizardContext';
import type { TranslationObject } from '../types/template';

export interface WizardContextValue {
  t: Record<string, unknown>;
  darkMode: boolean;
  step: number;
  animDir: 'next' | 'prev';
  validationErrors: Record<string, string>;
  onDownloadPDF: () => void;
  onDownloadAllTemplates: () => void;
  goToStep: (step: number) => void;
  setLang: (lang: string) => void;
  setDarkMode: (dark: boolean) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  resetForm: () => void;
}

export interface StepRendererProps {
  step: number;
  wizardContextValue: WizardContextValue;
  selectedTemplate: string;
  setSelectedTemplate: (t: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onGenerateText: () => void;
  onNavigationVisibilityChange: (visible: boolean) => void;
  handleNext: () => void;
  darkMode: boolean;
  t: TranslationObject;
  onOpenFaq: () => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  step,
  wizardContextValue,
  selectedTemplate,
  setSelectedTemplate,
  showToast,
  onGenerateText,
  onNavigationVisibilityChange,
  handleNext,
  darkMode,
  t,
  onOpenFaq,
}) => {
  if (step === 0) {
    return (
      <HeroRoute
        darkMode={darkMode}
        t={t}
        onStartClick={() => wizardContextValue.goToStep(1)}
        onOpenFaq={onOpenFaq}
      />
    );
  }

  if (step >= 1 && step <= 6) {
    const wizardContent = (
      <WizardRoute
        step={step}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        showToast={showToast}
        onGenerateText={onGenerateText}
        onNavigationVisibilityChange={onNavigationVisibilityChange}
      />
    );

    return (
      <WizardProvider value={wizardContextValue}>
        {step <= 4 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            noValidate
            style={{ display: 'contents' }}
          >
            {wizardContent}
            <button type="submit" className="sr-only" aria-hidden="true" tabIndex={-1} />
          </form>
        ) : (
          wizardContent
        )}
      </WizardProvider>
    );
  }

  return null;
};

export default StepRenderer;
