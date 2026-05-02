/**
 * AppContainer Component
 * Main app container - delegates routing to StepRenderer and modals to ModalsLayer
 */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useThemeContext,
  useToastContext,
  useTranslationContext,
  useWizardNavigationContext,
} from '../context/WizardProviders'
import { useFocusFirstFieldOnStep } from '../hooks/useFocusFirstFieldOnStep'
import { useSyncHtmlLang } from '../hooks/useSyncHtmlLang'
import { useWizardContextValue } from '../hooks/useWizardContextValue'
import { useFormValidation, useTemplateSelection, validateStep } from '../hooks'
import type { Language } from '../hooks/useTranslation'
import { useFormStore } from '../stores/formStore'
import type { TemplateType } from '../types/form'
import FaqJsonLd from './FaqJsonLd'
import type { LegalPageType } from './LegalPages'
import MaterialIcon from './MaterialIcon'
import ModalsLayer from './ModalsLayer'
import SeoHead from './SeoHead'
import StepRenderer from './StepRenderer'
import WizardShell from './WizardShell'
import WizardThankYouScreen from './WizardThankYouScreen'

const selectData = (s: ReturnType<typeof useFormStore.getState>) => s.data
const selectUpdateData = (s: ReturnType<typeof useFormStore.getState>) => s.updateData
const selectResetForm = (s: ReturnType<typeof useFormStore.getState>) => s.resetForm

interface AppContainerProps {
  onDownloadPDF: (templateType?: TemplateType) => Promise<void>
  onDownloadAllTemplates: () => Promise<void>
  onGenerateText: () => void
}

export const AppContainer: React.FC<AppContainerProps> = ({
  onDownloadPDF,
  onDownloadAllTemplates,
  onGenerateText,
}) => {
  const data = useFormStore(selectData)
  const updateData = useFormStore(selectUpdateData)
  const resetForm = useFormStore(selectResetForm)
  const { t, lang, setLang, isLoading: isTranslationLoading } = useTranslationContext()
  const navigate = useNavigate()
  const { step, animDir, goToStep } = useWizardNavigationContext()
  const { darkMode, setDarkMode, toggleTheme } = useThemeContext()
  const { showToast } = useToastContext()
  const { selectedTemplate, setSelectedTemplate, previewOpen, previewTemplate, closePreview } =
    useTemplateSelection()
  const { errors: validationErrors, isValid: isStepValid } = useFormValidation(data, step)

  const handleNext = () => {
    const { isValid } = validateStep(data, step)
    if (!isValid) {
      showToast(t?.validation?.fillRequired || 'Bitte füllen Sie die Pflichtfelder aus', 'error')
      return
    }
    goToStep(step + 1)
  }

  useFocusFirstFieldOnStep(step)

  const [legalPage, setLegalPage] = useState<LegalPageType>(null)
  const [faqOpen, setFaqOpen] = useState(false)
  const [navigationVisible, setNavigationVisible] = useState(true)

  useSyncHtmlLang(lang)

  useEffect(() => {
    if (step !== 4) setNavigationVisible(true)
  }, [step])

  const wizardContextValue = useWizardContextValue({
    t,
    darkMode,
    step,
    animDir,
    validationErrors,
    selectedTemplate,
    onDownloadPDF,
    onDownloadAllTemplates,
    goToStep,
    setLang,
    setDarkMode,
    showToast,
    resetForm,
  })

  if (isTranslationLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <MaterialIcon name="progress_activity" spin className="text-4xl text-inherit" />
        </div>
      </div>
    )
  }

  if (step === 7) {
    return (
      <>
        <SeoHead />
        <FaqJsonLd t={t} />
        <WizardThankYouScreen
          wizardContextValue={wizardContextValue}
          t={t}
          darkMode={darkMode}
          data={data}
          faqOpen={faqOpen}
          setFaqOpen={setFaqOpen}
          legalPage={legalPage}
          setLegalPage={setLegalPage}
          previewOpen={previewOpen}
          previewTemplate={previewTemplate}
          closePreview={closePreview}
        />
      </>
    )
  }

  return (
    <>
      <SeoHead />
      <FaqJsonLd t={t} />
      <WizardShell
        step={step}
        animDir={animDir}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        lang={lang as Language}
        onLangChange={(v: Language) => {
          updateData('lang', v)
          setLang(v)
          navigate(`/${v}/`, { replace: true })
        }}
        onLogoClick={() => goToStep(0)}
        t={t}
        isStepValid={isStepValid}
        navigationVisible={navigationVisible}
        onNavigationVisibilityChange={setNavigationVisible}
        onPrev={() => goToStep(step - 1)}
        onNext={handleNext}
        onStepClick={goToStep}
        onOpenLegal={(page) => setLegalPage(page)}
        onFaqClick={() => setFaqOpen(true)}
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
      </WizardShell>

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
  )
}

export default AppContainer
