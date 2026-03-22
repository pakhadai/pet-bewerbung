/**
 * ZIP export (all templates). Loaded only via dynamic import when user clicks
 * "Download ZIP". PDF helpers are injected from the caller so this module only
 * dynamically imports JSZip — avoids Rollup pulling JSZip into the main chunk.
 */

import type { PetData, TemplateType } from '../types/form';
import type { PdfTranslations } from './pdfService';
import type { TemplateOption } from './exportPdfService';

const PDF_GENERATION_PAUSE_MS = 800;

export interface ZipGenerationDeps {
  generatePdfBlob: (
    data: PetData,
    templateType: TemplateType,
    pdfT: PdfTranslations
  ) => Promise<Blob>;
  preparePdfData: (data: PetData) => Promise<PetData>;
}

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

let zipDownloadInFlight:
  | Promise<{ successCount: number; failedTemplates: string[] }>
  | null = null;

export async function downloadAllTemplatesAsZip(
  data: Record<string, any>,
  templateOptions: TemplateOption[],
  pdfT: PdfTranslations,
  deps: ZipGenerationDeps,
  options: {
    onProgress?: (msg: string) => void;
    onError?: (message: string) => void;
    zipMobileDisabled?: string;
    generatingZip?: string;
    zipDownloaded?: string;
    zipError?: string;
  } = {}
): Promise<{ successCount: number; failedTemplates: string[] }> {
  if (zipDownloadInFlight) return zipDownloadInFlight;

  const { generatePdfBlob, preparePdfData } = deps;

  zipDownloadInFlight = (async () => {
    const { default: JSZip } = await import('jszip');

    const zip = new JSZip();
    const petName = data.name || 'Pet-CV';
    const failedTemplates: string[] = [];
    let successCount = 0;

    // Single preparePdfData handles blob: → data URL, webp → jpeg (same as single PDF download)
    const pdfData = await preparePdfData(data as PetData);

    for (const template of templateOptions) {
      try {
        const id = template.id as TemplateType;
        const blob = await generatePdfBlob(pdfData, id, pdfT);
        zip.file(`${petName}-${id}.pdf`, blob);
        successCount++;
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
  })().finally(() => {
    zipDownloadInFlight = null;
  });

  return zipDownloadInFlight;
}
