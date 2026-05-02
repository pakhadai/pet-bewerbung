import { useCallback, useRef } from 'react'
import { downloadPdf } from '../services/exportPdfService'
import { buildPdfTranslations } from '../services/pdfService'
import type { PetData, TemplateType } from '../types/form'
import type { TranslationObject } from '../types/template'
import { trackUmamiEvent } from '../utils/umami'

export const usePdfDownloadJob = (args: {
  data: PetData
  t: TranslationObject
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void
}) => {
  const { data, t, showToast } = args
  const inFlightRef = useRef<Promise<void> | null>(null)

  return useCallback(
    async (templateType: TemplateType = 'classic') => {
      if (inFlightRef.current) {
        showToast(t?.labels?.pleaseWait || '…', 'info')
        return
      }

      const pdfT = buildPdfTranslations(t)
      const job = (async () => {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
        await downloadPdf(data, templateType, pdfT, {
          pdfSaveHint: t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"',
        })

        trackUmamiEvent('PDF_Downloaded', {
          template: templateType,
        })

        if (isIOS) {
          showToast(
            t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"',
            'info'
          )
        } else {
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
          showToast(isMobile ? 'PDF downloaded!' : 'PDF downloaded successfully!', 'success')
        }
      })()

      inFlightRef.current = job
      try {
        await job
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        if (import.meta.env.DEV) console.error('PDF generation error:', err)
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
          showToast(
            t?.ui?.pdfModuleError ||
              'Failed to load PDF module. Check your internet connection and try again.',
            'error'
          )
        } else if (errorMessage.includes('memory')) {
          showToast(
            t?.ui?.pdfMemoryError ||
              'PDF generation failed due to large image. Try reducing photo size.',
            'error'
          )
        } else if (errorMessage.includes('timeout')) {
          showToast(t?.ui?.pdfTimeoutError || 'PDF generation timed out. Please try again.', 'error')
        } else {
          showToast(t?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage, 'error')
        }
      } finally {
        if (inFlightRef.current === job) {
          inFlightRef.current = null
        }
      }
    },
    [data, t, showToast]
  )
}

