/**
 * Step6ThankYou - Thank you page after document creation
 */

import { FileArchive, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useWizardContext } from '../../context/WizardContext'
import { type Language, SUPPORTED_LANGS } from '../../hooks/useTranslation'
import { useFormStore } from '../../stores/formStore'
import type { FormData } from '../../types/form'
import Footer from '../Footer'
import Header from '../Header'
import type { LegalPageType } from '../LegalPages'
import LegalPages from '../LegalPages'
import MaterialIcon from '../MaterialIcon'

interface Step6ThankYouProps {
  onFaqClick?: () => void
}

const Step6ThankYou: React.FC<Step6ThankYouProps> = ({ onFaqClick: onFaqClickProp }) => {
  const data = useFormStore((s) => s.data) as FormData
  const updateData = useFormStore((s) => s.updateData)
  const {
    t,
    darkMode,
    setDarkMode,
    setLang,
    goToStep,
    onDownloadPDF,
    onDownloadAllTemplates,
    showToast,
    resetForm,
  } = useWizardContext()
  const [legalPage, setLegalPage] = useState<LegalPageType>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isGeneratingZip, setIsGeneratingZip] = useState(false)
  const onFaqClick =
    onFaqClickProp ?? (() => showToast(t?.footer?.faqComingSoon ?? 'FAQ — coming soon.', 'info'))

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return
    setIsGeneratingPdf(true)
    try {
      await Promise.resolve(onDownloadPDF())
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleLangChange = (v: Language) => {
    updateData('lang', v)
    setLang(v)
  }

  const handleDownloadZip = async () => {
    if (isGeneratingZip) return
    setIsGeneratingZip(true)
    try {
      await Promise.resolve(onDownloadAllTemplates())
    } finally {
      setIsGeneratingZip(false)
    }
  }

  return (
    <div className="min-h-screen font-sans antialiased pb-6 print:bg-white print:p-0 flex flex-col theme-bg theme-text">
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        lang={data.lang ?? 'de'}
        showSaveStatus={false}
        onLangChange={(v) => {
          if ((SUPPORTED_LANGS as readonly string[]).includes(v)) handleLangChange(v as Language)
        }}
        onLogoClick={() => goToStep(0)}
        t={t}
      />

      <main className="flex-grow flex flex-col items-center justify-center relative pt-32 pb-20 px-4">
        <div
          className="absolute top-[20%] left-[10%] opacity-20 pointer-events-none hidden lg:block animate-bounce select-none"
          style={{ animationDuration: '4s' }}
        >
          <MaterialIcon name="celebration" className="text-7xl rotate-12 text-primary" />
        </div>
        <div className="absolute bottom-[20%] right-[10%] opacity-20 pointer-events-none hidden lg:block animate-pulse select-none">
          <MaterialIcon
            name="pets"
            className="text-8xl -rotate-12 text-accent-pink dark:text-pink-400"
          />
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center text-center z-10 gap-8">
          <div className="relative">
            <div className="size-32 sm:size-40 bg-primary/20 blob-accent flex items-center justify-center hand-drawn-border border-primary">
              <MaterialIcon
                name="check_circle"
                className="text-7xl sm:text-8xl text-primary animate-pulse sketch-icon-filled"
              />
            </div>
            <span
              className={`absolute -top-4 -right-4 px-3 py-1 font-display font-bold text-xl rounded-full rotate-12 hand-drawn-border ${
                darkMode
                  ? 'bg-accent-pink text-gray-900 border-gray-900'
                  : 'bg-accent-pink text-gray-900 border-gray-200'
              }`}
            >
              {t?.thankYou?.purrPerfect ?? 'Purr-fect!'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2
              className={`text-6xl sm:text-8xl font-bold font-display leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {t?.thankYou?.allSet ?? t?.thankYou?.title ?? "You're All Set!"}
            </h2>
            <p
              className={`text-lg sm:text-xl max-w-xl leading-relaxed font-semibold ${darkMode ? 'text-gray-300' : 'text-text-secondary'}`}
            >
              {t?.thankYou?.subtitle ??
                t?.thankYou?.msg ??
                "Your pet's professional resume has been generated and is ready for the world to see."}
            </p>
          </div>

          <div className="w-full max-w-xl mt-4 flex flex-col gap-5">
            {
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className={`group relative w-full px-10 py-6 text-3xl sm:text-4xl font-bold font-display hand-drawn-button bg-primary hover:bg-primary-dark transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(179,157,219,0.2)] ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {isGeneratingPdf ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <MaterialIcon
                    name="download_for_offline"
                    className="text-4xl group-hover:scale-110 transition-transform"
                  />
                )}
                {t?.thankYou?.downloadPdf ?? t?.labels?.download ?? 'DOWNLOAD PDF'}
                <div
                  className="absolute -bottom-2 -right-2 w-full h-full border-2 border-dashed border-primary/40 -z-10 rounded-xl pointer-events-none"
                  aria-hidden
                />
              </button>
            }
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className={`w-full px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-xl font-display font-bold transition-all ${
                darkMode
                  ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              } ${isGeneratingZip ? 'opacity-70 cursor-not-allowed hover:bg-inherit' : ''}`}
            >
              {isGeneratingZip ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <FileArchive size={22} />
              )}
              {t?.labels?.downloadAllZip ?? 'Download ZIP archive'}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    t?.ui?.confirmReset ??
                      t?.validation?.confirmReset ??
                      'Are you sure? All data will be permanently deleted.'
                  )
                ) {
                  Promise.resolve(resetForm?.()).then(() => goToStep(0))
                }
              }}
              className={`text-primary transition-colors font-display text-xl ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
            >
              {t?.thankYou?.createAnother ?? t?.nav?.createAnother ?? 'Back to home'}
            </button>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className={`text-primary transition-colors font-display text-xl ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
            >
              {t?.nav?.backToData ?? 'Back to data'}
            </button>
          </div>
        </div>
      </main>

      <Footer
        darkMode={darkMode}
        t={t}
        onOpenLegal={(page) => setLegalPage(page)}
        onFaqClick={onFaqClick}
      />
      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  )
}

export default Step6ThankYou
