/**
 * Step5Preview - Document preview and download
 */

import { Check, FileArchive, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { TEMPLATE_LABELS, TEMPLATE_OPTIONS } from '../../constants'
import { useWizardContext } from '../../context/WizardContext'
import { useFormStore } from '../../stores/formStore'
import type { FormData, TemplateType } from '../../types/form'
import ErrorBoundary from '../ErrorBoundary'
import MaterialIcon from '../MaterialIcon'

const SwissDocument = lazy(() => import('../SwissDocument'))

interface Step5PreviewProps {
  selectedTemplate: TemplateType
}

const Step5Preview: React.FC<Step5PreviewProps> = ({ selectedTemplate }) => {
  const data = useFormStore((s) => s.data) as FormData
  const { t, animDir, darkMode, onDownloadPDF, onDownloadAllTemplates } = useWizardContext()
  const titleCl = darkMode ? 'text-white' : 'text-text-main'
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary'
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white'
  const borderCl = darkMode ? 'border-gray-700' : 'border-gray-200'

  const [isEnlarged, setIsEnlarged] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isGeneratingZip, setIsGeneratingZip] = useState(false)
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  const templateOption = TEMPLATE_OPTIONS.find((opt) => opt.id === selectedTemplate)

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isMobile = viewportWidth < 640
  const a4PxWidth = 794 // Approx. 210mm at 96dpi
  const mobilePadding = isEnlarged ? 32 : 48
  const fitScale = Math.max(0.32, (viewportWidth - mobilePadding) / a4PxWidth)
  const previewScale = isMobile
    ? isEnlarged
      ? Math.min(0.82, fitScale)
      : Math.min(0.52, fitScale)
    : isEnlarged
      ? 0.75
      : 0.55

  return (
    <div
      className={`page page-enter-${animDir} reveal fade-enter max-w-7xl mx-auto pb-40 sm:pb-32`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className={`font-display font-bold text-2xl md:text-3xl ${titleCl}`}>
            {t?.stepsNew?.step6?.title ?? 'Vorschau & Download'}
          </h2>
          <p className={`text-sm mt-1 ${mutedCl}`}>
            {t?.stepsNew?.step6?.subtitle ??
              'Überprüfen Sie Ihr Dokument und laden Sie es herunter'}
          </p>
        </div>
        <div
          className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${cardBg} border ${borderCl}`}
        >
          <Check size={16} className="text-green-500" />
          <span className={`font-medium text-sm ${titleCl}`}>
            {TEMPLATE_LABELS[selectedTemplate] ?? templateOption?.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          type="button"
          onClick={async () => {
            if (isGeneratingPdf) return
            setIsGeneratingPdf(true)
            try {
              await Promise.resolve(onDownloadPDF())
            } finally {
              setIsGeneratingPdf(false)
            }
          }}
          disabled={isGeneratingPdf}
          className={`theme-button-primary btn-press px-5 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
            isGeneratingPdf ? 'opacity-80 cursor-not-allowed' : ''
          }`}
        >
          {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : null}
          <MaterialIcon name="download_for_offline" className="text-xl" />
          <span>{t?.thankYou?.downloadPdf ?? t?.labels?.download ?? 'Download PDF'}</span>
        </button>

        <button
          type="button"
          onClick={async () => {
            if (isGeneratingZip) return
            setIsGeneratingZip(true)
            try {
              await Promise.resolve(onDownloadAllTemplates())
            } finally {
              setIsGeneratingZip(false)
            }
          }}
          disabled={isGeneratingZip}
          className={`btn-press px-5 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 border ${
            darkMode
              ? 'text-gray-100 bg-gray-800 border-gray-700 hover:bg-gray-750'
              : 'text-text-main bg-white border-gray-200 hover:bg-gray-50'
          } ${isGeneratingZip ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
          {isGeneratingZip ? <Loader2 size={18} className="animate-spin" /> : <FileArchive size={18} />}
          <span>{t?.labels?.downloadAllZip ?? 'Download ZIP'}</span>
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <div className="col-span-1">
          <div className={`relative rounded-2xl border ${borderCl} ${cardBg} overflow-hidden`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${borderCl}`}>
              <div className="flex items-center gap-3" />
              <button
                type="button"
                onClick={() => setIsEnlarged(!isEnlarged)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isEnlarged ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span className="hidden sm:inline">
                  {isEnlarged ? 'Verkleinern' : 'Vergrößern'}
                </span>
              </button>
            </div>

            <div
              className="overflow-auto flex justify-center bg-gray-100 dark:bg-gray-900/50"
              style={{
                height: isEnlarged ? (isMobile ? '68vh' : '72vh') : isMobile ? '54vh' : '58vh',
              }}
            >
              <div className="py-6">
                <div
                  id="pdf-document"
                  className="bg-white shadow-2xl rounded-sm relative"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    flexShrink: 0,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top center',
                  }}
                >
                  <ErrorBoundary
                    fallbackTitle={t?.ui?.previewError || 'Fehler'}
                    fallbackMessage={
                      t?.ui?.previewErrorMessage || 'Dokument konnte nicht geladen werden.'
                    }
                  >
                    <Suspense
                      fallback={<div className="bg-white p-8 rounded-lg">Loading preview...</div>}
                    >
                      <SwissDocument data={data} t={t} templateType={selectedTemplate} />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step5Preview
