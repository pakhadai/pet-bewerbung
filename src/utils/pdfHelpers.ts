/**
 * PDF Generation Helper Functions
 * Extracted from App.tsx for better maintainability
 */

/**
 * Convert blob URL to data URL
 * @param blobUrl - Blob URL to convert
 * @returns Data URL or null if failed
 */
export async function blobUrlToDataUrl(blobUrl: string): Promise<string | null> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Convert WebP data URL to JPEG data URL
 * @param webpDataUrl - WebP data URL
 * @returns JPEG data URL
 */
export async function toJpegDataUrl(webpDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = webpDataUrl;
  });
}

/**
 * Fetch logo as data URL
 * @returns Logo data URL or null
 */
export async function fetchLogoAsDataUrl(): Promise<string | null> {
  try {
    const response = await fetch('/logo.png');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Generate QR code data URL
 * @param content - QR code content
 * @param options - QR code options
 * @returns QR code data URL or null
 */
export async function generateQrDataUrl(
  content: string,
  options: { size?: number; margin?: number } = {}
): Promise<string | null> {
  try {
    const { default: QRCode } = await import('qrcode');
    return await QRCode.toDataURL(content, {
      width: options.size || 400,
      margin: options.margin || 2,
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return null;
  }
}

/**
 * Get QR code content from pet data
 * @param data - Pet data
 * @returns QR code content or null
 */
export function getQrContent(data: any): string | null {
  if (!data.email && !data.phone) return null;

  const lines = [];
  if (data.firstName || data.lastName) {
    lines.push(`${data.firstName || ''} ${data.lastName || ''}`.trim());
  }
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.phone) lines.push(`Tel: ${data.phone}`);

  return lines.length > 0 ? lines.join('\n') : null;
}

/**
 * Download PDF blob with appropriate method for device
 * @param blob - PDF blob
 * @param filename - File name
 * @param translations - Translation object for messages
 * @returns Success/error message
 */
export function downloadPdfBlob(
  blob: Blob,
  filename: string,
  translations?: any
): { success: boolean; message: string; type: 'success' | 'info' | 'error' } {
  const url = URL.createObjectURL(blob);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) window.location.href = url;

    // Cleanup after 5 seconds
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    return {
      success: true,
      message: translations?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"',
      type: 'info',
    };
  } else if (isMobile) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 5000);

    return {
      success: true,
      message: 'PDF downloaded!',
      type: 'success',
    };
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 5000);

    return {
      success: true,
      message: 'PDF downloaded successfully!',
      type: 'success',
    };
  }
}

/**
 * Handle PDF generation errors with appropriate messages
 * @param err - Error object
 * @param translations - Translation object
 * @returns Error message
 */
export function handlePdfError(err: unknown, translations?: any): string {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';

  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
    return translations?.ui?.pdfModuleError ||
      'Failed to load PDF module. Check your internet connection and try again.';
  } else if (errorMessage.includes('memory')) {
    return translations?.ui?.pdfMemoryError ||
      'PDF generation failed due to large image. Try reducing photo size.';
  } else if (errorMessage.includes('timeout')) {
    return translations?.ui?.pdfTimeoutError ||
      'PDF generation timed out. Please try again.';
  } else {
    return translations?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage;
  }
}
