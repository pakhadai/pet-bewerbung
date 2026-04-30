/**
 * ModalsLayer - Renders all app modals in one place
 * FaqModal, LegalPages, PreviewModal
 */

import { Camera, X } from 'lucide-react'
import React, { Suspense, useEffect } from 'react'
import type { PetData, TemplateType } from '../types/form'
import type { TranslationObject } from '../types/template'
import { lazyRetry } from '../utils/lazyRetry'
import ErrorBoundary from './ErrorBoundary'
import FaqModal from './FaqModal'
import LegalPages, { type LegalPageType } from './LegalPages'

const SwissDocument = lazyRetry(() => import('./SwissDocument'))

export interface ModalsLayerProps {
  t: TranslationObject
  darkMode: boolean
  faqOpen: boolean
  setFaqOpen: (open: boolean) => void
  legalPage: LegalPageType
  setLegalPage: (page: LegalPageType) => void
  previewOpen: boolean
  previewTemplate: TemplateType
  closePreview: () => void
  data: PetData
  /** When false (e.g. step 7 ThankYou), hide LegalPages */
  showLayoutModals?: boolean
}

const ModalsLayer: React.FC<ModalsLayerProps> = ({
  t,
  darkMode,
  faqOpen,
  setFaqOpen,
  legalPage,
  setLegalPage,
  previewOpen,
  previewTemplate,
  closePreview,
  data,
  showLayoutModals = true,
}) => {
  const anyModalOpen = faqOpen || legalPage !== null || previewOpen

  /** Block page scroll under any overlay */
  useEffect(() => {
    if (!anyModalOpen) return
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [anyModalOpen])

  /** Close topmost overlay with Escape */
  useEffect(() => {
    if (!anyModalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      if (previewOpen) closePreview()
      else if (legalPage) setLegalPage(null)
      else if (faqOpen) setFaqOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [anyModalOpen, previewOpen, legalPage, faqOpen, closePreview, setLegalPage, setFaqOpen])

  return (
    <>
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} t={t} darkMode={darkMode} />

      {showLayoutModals && (
        <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-50 print:hidden">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={closePreview}
            role="presentation"
            aria-hidden
          />
          <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto relative flex max-h-full w-full max-w-4xl flex-col items-center justify-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  closePreview()
                }}
                className="absolute top-4 right-4 z-20 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                aria-label={t?.ui?.closePreview ?? 'Close preview'}
              >
                <X size={32} />
              </button>

              <div className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                <Camera size={18} aria-hidden /> {t?.ui?.previewMode} — {previewTemplate}
              </div>

              <div className="w-full flex-1 min-h-0 overflow-auto flex justify-center items-start pt-2">
                <div className="origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 shadow-2xl">
                  <ErrorBoundary
                    fallbackTitle="Preview Error"
                    fallbackMessage="Failed to render document preview. Please check your data and try again."
                    onReset={closePreview}
                  >
                    <Suspense
                      fallback={<div className="bg-white p-8 rounded-lg">Loading preview...</div>}
                    >
                      <SwissDocument data={data} t={t} templateType={previewTemplate} />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ModalsLayer
