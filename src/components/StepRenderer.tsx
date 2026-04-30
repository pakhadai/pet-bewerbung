/**
 * StepRenderer - Renders main content based on step
 * Routes: Hero (0), Wizard (1-6). Step 7 (ThankYou) is handled by AppContainer.
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { type WizardContextValue, WizardProvider } from '../context/WizardContext'
import { useTranslationContext } from '../context/WizardProviders'
import HeroRoute from '../routes/HeroRoute'
import WizardRoute from '../routes/WizardRoute'
import type { TemplateType } from '../types/form'
import type { TranslationObject } from '../types/template'

export interface StepRendererProps {
  step: number
  wizardContextValue: WizardContextValue
  selectedTemplate: TemplateType
  setSelectedTemplate: (t: TemplateType) => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  onGenerateText: () => void
  onNavigationVisibilityChange: (visible: boolean) => void
  handleNext: () => void
  darkMode: boolean
  t: TranslationObject
  onOpenFaq: () => void
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
  const navigate = useNavigate()
  const { lang } = useTranslationContext()

  if (step === 0) {
    return (
      <HeroRoute
        darkMode={darkMode}
        t={t}
        onStartClick={() => navigate(`/${lang}/builder`)}
        onOpenFaq={onOpenFaq}
      />
    )
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
    )

    return (
      <WizardProvider value={wizardContextValue}>
        {step <= 4 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleNext()
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
    )
  }

  return null
}

export default StepRenderer
