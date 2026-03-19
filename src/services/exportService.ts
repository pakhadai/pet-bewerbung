/**
 * Export Service
 * PDF download and ZIP generation logic.
 * Orchestrates pdfService for generation, handles download flow.
 */

import { toJpegDataUrl } from '../utils/imageCompression';
import {
  generatePdfBlob,
  preparePdfData,
  type PdfTranslations,
} from './pdfService';

export interface TemplateOption {
  id: string;
  label?: string;
}

/** Pause between PDF generations to allow GC - React-PDF holds large WASM/canvas memory */
const PDF_GENERATION_PAUSE_MS = 1200;

/**
 * Trigger browser download of a blob
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
  setTimeout(() => URL.revokeObjectURL(url), 60000); // 60s allows slow devices / "Save as" dialog; avoids memory leak on repeated downloads
}

/**
 * Download single PDF
 */
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
  const filename = `${data.name || 'Pet-CV'}-${Date.now()}.pdf`;
  const pdfData = await preparePdfData(data);

  const blob = await generatePdfBlob(pdfData, templateType, pdfT);
  const url = URL.createObjectURL(blob);

  const isIOS = options.isIOS ?? /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = options.isMobile ?? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isIOS) {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 2000); // 2s for iOS save dialog; avoids memory leak
  } else {
    downloadBlob(blob, filename);
    URL.revokeObjectURL(url);
  }
}

/**
 * Generate ZIP with all templates
 * Disabled on mobile - OOM risk. Use downloadPdf for single templates instead.
 */
export async function downloadAllTemplatesAsZip(
  data: Record<string, any>,
  templateOptions: TemplateOption[],
  pdfT: PdfTranslations,
  options: {
    onProgress?: (msg: string) => void;
    onError?: (message: string) => void;
    zipMobileDisabled?: string;
    generatingZip?: string;
    zipDownloaded?: string;
    zipError?: string;
  } = {}
): Promise<{ successCount: number; failedTemplates: string[] }> {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    throw new Error(options.zipMobileDisabled ?? 'ZIP download disabled on mobile. Please download templates individually.');
  }

  // Convert photo once before loop (avoids N conversions per template)
  let optimizedData: Record<string, any> | undefined;
  if (data.photo && typeof data.photo === 'string') {
    try {
      let photoUrl = data.photo;
      if (photoUrl.startsWith('data:image/webp')) {
        photoUrl = await toJpegDataUrl(photoUrl);
      }
      optimizedData = { ...data, photo: photoUrl };
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Photo conversion failed for ZIP:', err);
      optimizedData = { ...data, photo: null };
    }
  }

  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const petName = data.name || 'Pet-CV';
  const failedTemplates: string[] = [];
  let successCount = 0;

  for (const template of templateOptions) {
    try {
      const pdfData = optimizedData ?? (await preparePdfData(data));
      const blob = await generatePdfBlob(pdfData, template.id, pdfT);
      zip.file(`${petName}-${template.id}.pdf`, blob);
      successCount++;
      // Pause: GC doesn't run on demand; React-PDF holds large WASM/canvas memory.
      // Shorter pauses cause OOM on Safari/iOS and low-RAM Android.
      await new Promise((r) => setTimeout(r, PDF_GENERATION_PAUSE_MS));
    } catch (err) {
      failedTemplates.push(template.label || template.id);
      if (import.meta.env.DEV) {
        console.error(`Failed to generate ${template.id}:`, err);
      }
    }
  }

  if (successCount === 0) {
    throw new Error(options.zipError ?? 'Failed to generate any PDF templates');
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${petName}-alle-vorlagen.zip`);

  return { successCount, failedTemplates };
}
