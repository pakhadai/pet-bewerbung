import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccordionSection from '../components/builder/AccordionSection'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import ModalsLayer from '../components/ModalsLayer'
import {
  Step1Details,
  Step2HealthInsurance,
  Step3Description,
  Step4Photo,
  Step5TemplateSelect,
} from '../components/steps/index'
import { WizardProvider } from '../context/WizardContext'
import { useThemeContext, useToastContext, useTranslationContext } from '../context/WizardProviders'
import { useTemplateSelection } from '../hooks'
import { validateStep } from '../hooks/useFormValidation'
import { type Language, SUPPORTED_LANGS } from '../hooks/useTranslation'
import { useFormStore } from '../stores/formStore'

const SwissDocument = lazy(() => import('../components/SwissDocument'))

type Props = {
  onGenerateText: () => void
}

const noopAsync = async () => undefined
const noop = () => undefined

export default function BuilderRoute({ onGenerateText }: Props) {
  const navigate = useNavigate()
  const data = useFormStore((s) => s.data)
  const resetForm = useFormStore((s) => s.resetForm)
  const { t, lang, setLang } = useTranslationContext()
  const { darkMode, toggleTheme, setDarkMode } = useThemeContext()
  const { showToast } = useToastContext()

  const {
    selectedTemplate,
    setSelectedTemplate,
    previewOpen,
    previewTemplate,
    openPreview,
    closePreview,
  } = useTemplateSelection()
  const [inlinePreviewOpen, setInlinePreviewOpen] = useState<boolean>(false)

  const { isValid: isStep1Valid } = useMemo(() => validateStep(data, 1), [data])

  const openPrint = useCallback(() => {
    const w = window.open(`/${lang}/print`, '_blank', 'noopener,noreferrer')
    if (!w) {
      showToast(t?.ui?.popupBlocked ?? 'Please allow popups to open the print view.', 'warning')
    }
  }, [lang, showToast, t])

  const onLangChange = useCallback(
    (nextLang: string) => {
      if (!SUPPORTED_LANGS.includes(nextLang as Language)) return
      setLang(nextLang as Language)
      useFormStore.getState().updateData('lang', nextLang as Language)
      navigate(`/${nextLang}/builder`, { replace: true })
    },
    [navigate, setLang]
  )

  const wizardContextValue = useMemo(
    () => ({
      t,
      darkMode,
      step: 1,
      animDir: 'right' as const,
      validationErrors: {},
      onDownloadPDF: async () => openPrint(),
      onDownloadAllTemplates: noopAsync,
      goToStep: noop,
      setLang: (l: string) => onLangChange(l),
      setDarkMode,
      showToast,
      resetForm,
    }),
    [t, darkMode, openPrint, onLangChange, setDarkMode, showToast, resetForm]
  )

  return (
    <>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleTheme}
        lang={lang}
        showSaveStatus
        onLangChange={onLangChange}
        onLogoClick={() => navigate(`/${lang}/`, { replace: false })}
        t={t}
      />

      <WizardProvider value={wizardContextValue}>
        <main className="w-full pt-[92px] px-4 md:px-8 pb-20 print:hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2
                  className={`font-display font-bold text-2xl md:text-3xl ${darkMode ? 'text-white' : 'text-text-main'}`}
                >
                  {t?.builder?.title ?? 'Pet-CV Builder'}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                  {t?.builder?.subtitle ?? 'Edit fields and preview the A4 document live.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openPrint}
                  disabled={!isStep1Valid}
                  className={`btn-press px-4 py-2 rounded-xl font-semibold flex items-center gap-2 border transition-all ${
                    isStep1Valid
                      ? darkMode
                        ? 'text-gray-100 bg-primary/80 hover:bg-primary border-primary'
                        : 'text-white bg-primary hover:bg-primary-dark border-primary'
                      : darkMode
                        ? 'text-gray-400 bg-gray-800 border-gray-700 cursor-not-allowed opacity-70'
                        : 'text-gray-400 bg-white border-gray-200 cursor-not-allowed opacity-70'
                  }`}
                  title={
                    isStep1Valid
                      ? (t?.builder?.draftHint ??
                        'Create a first draft PDF now (you can refine later).')
                      : (t?.builder?.draftDisabledHint ??
                        'Fill in the required basics first (Owner name, Pet name, Pet type).')
                  }
                >
                  <MaterialIcon name="auto_awesome" className="text-xl" />
                  <span>{t?.builder?.draftCta ?? 'Create draft PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={openPrint}
                  className={`btn-press px-4 py-2 rounded-xl font-semibold flex items-center gap-2 border ${
                    darkMode
                      ? 'text-gray-100 bg-gray-800 border-gray-700 hover:bg-gray-750'
                      : 'text-text-main bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <MaterialIcon name="picture_as_pdf" className="text-xl" />
                  <span>{t?.ui?.print ?? 'PDF / Print'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Form sections */}
              <div className="space-y-6">
                <AccordionSection
                  title={t?.stepsNew?.step1?.title ?? 'Owner & Pet'}
                  description={t?.stepsNew?.step1?.subtitle ?? 'Basics that appear in the document'}
                  defaultOpen
                >
                  <Step1Details embedded />
                </AccordionSection>

                <AccordionSection
                  title={t?.stepsNew?.step2?.title ?? 'Emergency & more'}
                  description={
                    t?.stepsNew?.step2?.subtitle ?? 'Vet, insurance, behavior, references'
                  }
                >
                  <Step2HealthInsurance embedded />
                </AccordionSection>

                <AccordionSection
                  title={t?.stepsNew?.step3?.title ?? t?.labels?.tellUsAboutPet ?? 'About your pet'}
                  description={t?.labels?.descriptionHint ?? 'Personality, habits, special notes'}
                >
                  <Step3Description embedded onGenerate={onGenerateText} />
                </AccordionSection>

                <AccordionSection
                  title={t?.stepsNew?.step4?.title ?? 'Photo'}
                  description={t?.stepsNew?.step4?.subtitle ?? 'A strong first impression'}
                >
                  <Step4Photo embedded onNavigationVisibilityChange={noop} showToast={showToast} />
                </AccordionSection>

                <AccordionSection
                  title={t?.stepsNew?.step5?.title ?? 'Template'}
                  description={t?.stepsNew?.step5?.subtitle ?? 'Choose the document design'}
                >
                  <Step5TemplateSelect
                    embedded
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                  />
                </AccordionSection>
              </div>

              {/* Live preview (desktop) — opt-in to reduce cognitive load */}
              <div className="hidden lg:block lg:sticky lg:top-24">
                <div
                  className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div
                    className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div
                      className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-text-main'}`}
                    >
                      {t?.ui?.preview ?? 'Preview'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openPreview(selectedTemplate)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg border ${
                          darkMode
                            ? 'border-gray-700 text-gray-200 hover:bg-gray-750'
                            : 'border-gray-200 text-text-main hover:bg-gray-50'
                        }`}
                      >
                        {t?.builder?.openPreview ?? 'Open'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInlinePreviewOpen((v) => !v)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg border ${
                          darkMode
                            ? 'border-gray-700 text-gray-200 hover:bg-gray-750'
                            : 'border-gray-200 text-text-main hover:bg-gray-50'
                        }`}
                        aria-expanded={inlinePreviewOpen}
                      >
                        {inlinePreviewOpen
                          ? (t?.builder?.hidePreview ?? 'Hide')
                          : (t?.builder?.showPreview ?? 'Show')}
                      </button>
                    </div>
                  </div>

                  {inlinePreviewOpen ? (
                    <div
                      className="overflow-auto flex justify-center bg-gray-100 dark:bg-gray-900/50"
                      style={{ height: '72vh' }}
                    >
                      <div className="py-6">
                        <div
                          className="bg-white shadow-2xl rounded-sm relative"
                          style={{
                            width: '210mm',
                            height: '297mm',
                            flexShrink: 0,
                            transform: 'scale(0.55)',
                            transformOrigin: 'top center',
                          }}
                        >
                          <Suspense
                            fallback={
                              <div className="bg-white p-8 rounded-lg">Loading preview...</div>
                            }
                          >
                            <SwissDocument data={data} t={t} templateType={selectedTemplate} />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-5 ${darkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
                      <div
                        className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-text-main'}`}
                      >
                        {t?.builder?.previewCollapsedTitle ?? 'Focus on the form first'}
                      </div>
                      <div className="text-sm mt-1 leading-relaxed">
                        {t?.builder?.previewCollapsedBody ??
                          'Preview is optional while you fill in details. Open it when you want to review the final A4 layout.'}
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInlinePreviewOpen(true)}
                          className="theme-button-primary btn-press px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                        >
                          <MaterialIcon name="verified" className="text-xl" />
                          <span>{t?.builder?.showPreview ?? 'Show preview'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openPreview(selectedTemplate)}
                          className={`btn-press px-4 py-2 rounded-xl font-semibold flex items-center gap-2 border ${
                            darkMode
                              ? 'text-gray-100 bg-gray-800 border-gray-700 hover:bg-gray-750'
                              : 'text-text-main bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <MaterialIcon name="arrow_forward" className="text-xl" />
                          <span>{t?.builder?.openPreview ?? 'Open preview'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: hide inline preview, show sticky action instead */}
          <div className="lg:hidden fixed left-0 right-0 bottom-0 z-40 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
            <div className="max-w-7xl mx-auto pointer-events-auto">
              <button
                type="button"
                onClick={() => openPreview(selectedTemplate)}
                className="w-full theme-button-primary btn-press cta-glow px-4 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-2xl"
              >
                <MaterialIcon name="picture_as_pdf" className="text-xl" />
                <span>{t?.ui?.preview ?? 'Preview'}</span>
              </button>
            </div>
          </div>
        </main>
      </WizardProvider>

      <ModalsLayer
        t={t}
        darkMode={darkMode}
        faqOpen={false}
        setFaqOpen={noop}
        legalPage={null}
        setLegalPage={noop}
        previewOpen={previewOpen}
        previewTemplate={previewTemplate || selectedTemplate}
        closePreview={closePreview}
        data={data}
        showLayoutModals={false}
      />
    </>
  )
}
