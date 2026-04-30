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
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    // Blob URL conversion failed - caller handles null gracefully
    if (typeof window !== 'undefined' && import.meta.env?.DEV)
      console.warn('Blob URL conversion failed:', err)
    return null
  }
}
