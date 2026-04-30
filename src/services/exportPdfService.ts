/**
 * Single-PDF export (browser download). Kept separate from ZIP so the main bundle
 * does not reference the JSZip chunk until ZIP is requested.
 */

import type { PetData, TemplateType } from '../types/form'
import { generatePdfBlob, type PdfTranslations, preparePdfData } from './pdfService'

export interface TemplateOption {
  id: string
  label?: string
}

/** Strip characters that break `download=` or filesystem paths */
function sanitizeFilename(name: string): string {
  const trimmed = name
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
  return trimmed.length > 0 ? trimmed.slice(0, 180) : 'Pet-CV'
}

/**
 * Trigger browser download of a blob.
 * Revoke URL after 10 seconds — rAF is too fast for large ZIPs on slow connections
 * and can abort the download before the browser finishes streaming to disk.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export async function downloadPdf(
  data: PetData,
  templateType: TemplateType,
  pdfT: PdfTranslations,
  options: {
    onError?: (message: string) => void
    isIOS?: boolean
    isMobile?: boolean
    pdfSaveHint?: string
  } = {}
): Promise<void> {
  const rawName = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : 'Pet-CV'
  const filename = `${sanitizeFilename(rawName)}-${Date.now()}.pdf`
  const pdfData = await preparePdfData(data)

  const blob = await generatePdfBlob(pdfData, templateType, pdfT)

  const isIOS = options.isIOS ?? /iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isIOS) {
    // New tab needs the blob URL to stay valid while Safari loads the PDF; revoking too early breaks the view/download.
    const url = URL.createObjectURL(blob)
    const newWindow = window.open(url, '_blank')
    if (!newWindow) window.location.href = url
    setTimeout(() => URL.revokeObjectURL(url), 120_000)
  } else {
    downloadBlob(blob, filename)
  }
}
