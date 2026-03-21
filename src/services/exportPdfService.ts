/**
 * Single-PDF export (browser download). Kept separate from ZIP so the main bundle
 * does not reference the JSZip chunk until ZIP is requested.
 */

import {
  generatePdfBlob,
  preparePdfData,
  type PdfTranslations,
} from './pdfService';

export interface TemplateOption {
  id: string;
  label?: string;
}

/**
 * Trigger browser download of a blob.
 * Revoke URL after 10 seconds — rAF is too fast for large ZIPs on slow connections
 * and can abort the download before the browser finishes streaming to disk.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

let pdfDownloadInFlight: Promise<void> | null = null;

export async function downloadPdf(
  data: Record<string, any>,
  templateType: string,
  pdfT: PdfTranslations,
  options: {
    onError?: (message: string) => void;
    isIOS?: boolean;
    isMobile?: boolean;
    pdfSaveHint?: string;
  } = {}
): Promise<void> {
  if (pdfDownloadInFlight) return pdfDownloadInFlight;

  pdfDownloadInFlight = (async () => {
    const filename = `${data.name || 'Pet-CV'}-${Date.now()}.pdf`;
    const pdfData = await preparePdfData(data);

    const blob = await generatePdfBlob(pdfData, templateType, pdfT);
    const url = URL.createObjectURL(blob);

    const isIOS = options.isIOS ?? /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMobile = options.isMobile ?? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isIOS) {
      const newWindow = window.open(url, '_blank');
      if (!newWindow) window.location.href = url;
      requestAnimationFrame(() => setTimeout(() => URL.revokeObjectURL(url), 500));
    } else {
      downloadBlob(blob, filename);
      URL.revokeObjectURL(url);
    }
  })().finally(() => {
    pdfDownloadInFlight = null;
  });

  return pdfDownloadInFlight;
}
