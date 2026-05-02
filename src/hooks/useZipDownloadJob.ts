import { useCallback, useRef } from 'react'
import { TEMPLATE_OPTIONS } from '../constants'
import { buildPdfTranslations, generatePdfBlob, preparePdfData } from '../services/pdfService'
import type { PetData } from '../types/form'
import type { TranslationObject } from '../types/template'
import { trackUmamiEvent } from '../utils/umami'

export const useZipDownloadJob = (args: {
  data: PetData
  t: TranslationObject
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void
}) => {
  const { data, t, showToast } = args
  const inFlightRef = useRef<Promise<void> | null>(null)

  return useCallback(async () => {
    if (inFlightRef.current) {
      showToast(t?.labels?.pleaseWait || '…', 'info')
      return
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      showToast(
        t?.labels?.zipMobileDisabled ??
          'ZIP-Download auf Mobilgeräten deaktiviert. Bitte einzelne Vorlagen herunterladen.',
        'info'
      )
      return
    }

    showToast(t?.labels?.generatingZip || 'Generiere alle Vorlagen...', 'info')
    const pdfT = buildPdfTranslations(t)

    const job = (async () => {
      const { downloadAllTemplatesAsZip } = await import('../services/exportZipService')
      const { successCount, failedTemplates } = await downloadAllTemplatesAsZip(
        data,
        TEMPLATE_OPTIONS,
        pdfT,
        {
          generatePdfBlob,
          preparePdfData,
        },
        {
          zipMobileDisabled:
            t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert.',
          generatingZip: t?.labels?.generatingZip || 'Generiere alle Vorlagen...',
          zipDownloaded: t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!',
          zipError: t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs',
        }
      )

      trackUmamiEvent('ZIP_Downloaded', {
        successCount,
        failedCount: failedTemplates.length,
      })

      if (failedTemplates.length > 0) {
        showToast(
          `${successCount}/${TEMPLATE_OPTIONS.length} templates generated. Failed: ${failedTemplates.join(', ')}`,
          'warning'
        )
      } else {
        showToast(t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!', 'success')
      }
    })()

    inFlightRef.current = job
    try {
      await job
    } catch (err: unknown) {
      if (import.meta.env.DEV) console.error('ZIP generation error:', err)
      showToast(t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs', 'error')
    } finally {
      if (inFlightRef.current === job) {
        inFlightRef.current = null
      }
    }
  }, [data, t, showToast])
}

