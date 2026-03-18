/**
 * Image compression utility
 * Compresses images client-side before storing to state.
 * Uses WebP when supported for ~25–35% smaller size than JPEG.
 * Uses createImageBitmap with imageOrientation: "from-image" for EXIF correction (iPhone photos).
 */

/** Load image with EXIF orientation applied (createImageBitmap) or fallback to Image */
async function loadImageWithOrientation(source) {
  if (typeof createImageBitmap !== 'function') {
    return loadImageLegacy(source);
  }
  try {
    let blob;
    if (source instanceof Blob || source instanceof File) {
      blob = source;
    } else if (typeof source === 'string') {
      const res = await fetch(source);
      blob = await res.blob();
    } else {
      return loadImageLegacy(source);
    }
    const opts = { imageOrientation: 'from-image' };
    const bitmap = await createImageBitmap(blob, opts);
    return { bitmap, width: bitmap.width, height: bitmap.height, isBitmap: true };
  } catch {
    return loadImageLegacy(source);
  }
}

function loadImageLegacy(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.onload = () => resolve({ img, width: img.naturalWidth, height: img.naturalHeight, isBitmap: false });
    img.src = typeof source === 'string' ? source : (source instanceof Blob || source instanceof File) ? URL.createObjectURL(source) : source;
  });
}

/** Check if WebP is supported in canvas */
function supportsWebP() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

const WEBP_SUPPORTED = typeof document !== 'undefined' && supportsWebP();

/**
 * Compresses an image file and returns a base64 data URL (WebP or JPEG)
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 800)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 800)
 * @param {number} options.quality - Quality 0-1 (default: 0.8)
 * @param {number} options.maxSizeKB - Target max file size in KB (default: 500)
 * @param {string} options.format - 'webp' | 'jpeg' (default: 'webp' if supported)
 * @param {number} options.timeout - Timeout in ms (default: 10000)
 * @returns {Promise<string>} - Base64 data URL of compressed image
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500,
    format = WEBP_SUPPORTED ? 'webp' : 'jpeg',
    timeout = 10000, // 10 second timeout
  } = options;

  const mime = format === 'webp' ? 'image/webp' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    // Set timeout to prevent browser hanging on large images
    const timeoutId = setTimeout(() => {
      reject(new Error('Image compression timeout - image too large'));
    }, timeout);
    if (!file.type.startsWith('image/')) {
      clearTimeout(timeoutId);
      reject(new Error('File is not an image'));
      return;
    }

    const processImage = async () => {
      try {
        const loaded = await loadImageWithOrientation(file);
        clearTimeout(timeoutId);
        let { width, height } = loaded;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        if (loaded.isBitmap) {
          ctx.drawImage(loaded.bitmap, 0, 0, width, height);
          loaded.bitmap.close();
        } else {
          ctx.drawImage(loaded.img, 0, 0, width, height);
        }

        const maxSizeBytes = maxSizeKB * 1024;
        const getBlob = (mimeType, q) =>
          new Promise((res, rej) => {
            canvas.toBlob(res, mimeType, q);
          });

        const compressIteratively = async () => {
          let currentQuality = quality;
          let blob = null;
          let effectiveMime = mime;
          for (let i = 0; i < 5; i++) {
            try {
              blob = await getBlob(effectiveMime, currentQuality);
            } catch (err) {
              console.warn('toBlob failed, fallback to JPEG:', err);
              effectiveMime = 'image/jpeg';
              blob = await getBlob(effectiveMime, currentQuality);
            }
            if (blob && (blob.size <= maxSizeBytes || currentQuality <= 0.3)) break;
            currentQuality -= 0.1;
            await new Promise((r) => setTimeout(r, 0)); // Yield to main thread
          }
          if (!blob) blob = await getBlob('image/jpeg', 0.5);

          return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
        };

        compressIteratively()
          .then((result) => {
            canvas.width = 0;
            canvas.height = 0;
            resolve(result);
          })
          .catch((err) => {
            canvas.width = 0;
            canvas.height = 0;
            reject(err);
          });
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      }
    };

    processImage();
  });
};

/**
 * Convert data URL to JPEG (for PDF compatibility when source is WebP)
 * @param {string} dataUrl - data:image/webp;base64,... or data:image/jpeg;base64,...
 * @returns {Promise<string>} - JPEG data URL
 */
export async function toJpegDataUrl(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  if (dataUrl.startsWith('data:image/jpeg')) return dataUrl;

  if (typeof createImageBitmap === 'function') {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert to JPEG'));
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          0.85
        );
      });
    } catch {
      /* fallback to Image below */
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert to JPEG'));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.85
      );
    };
    img.src = dataUrl;
  });
}

/**
 * Gets the approximate size in bytes of a base64 string
 * @param {string} base64 - Base64 data URL
 * @returns {number} - Approximate size in bytes
 */
export const getBase64Size = (base64) => {
  // Remove data URL prefix
  const base64String = base64.split(',')[1] || base64;
  // Base64 encoding increases size by ~33%, so multiply by 0.75 to get original size
  return Math.round((base64String.length * 3) / 4);
};

/**
 * Formats file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default compressImage;
