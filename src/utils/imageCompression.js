/**
 * Image compression utility
 * Compresses images client-side before storing to state.
 * Uses WebP when supported for ~25–35% smaller size than JPEG.
 * Uses createImageBitmap with imageOrientation: "from-image" for EXIF correction (iPhone photos).
 *
 * SECURITY: Image Bomb protection - parse dimensions from file headers BEFORE decode.
 * createImageBitmap decodes the full image into RAM; a 2MB "zip bomb" JPEG can expand to
 * 30000x30000 = 3.6GB and crash the tab before checkDimensions runs.
 */

const MAX_DIMENSION = 8000; // Pixel flood attack protection
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB - reduces Image Bomb risk

function checkDimensions(width, height) {
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error(`Image dimensions too large. Maximum allowed is ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.`);
  }
}

/**
 * Parse image dimensions from file header WITHOUT decoding (Image Bomb protection).
 * Returns { width, height } or null if format unsupported / parse failed.
 */
async function getImageDimensionsFromHeader(blob) {
  const buf = await blob.slice(0, 64 * 1024).arrayBuffer(); // First 64KB is enough for headers
  const arr = new Uint8Array(buf);

  // PNG: bytes 16-19 = width, 20-23 = height (big-endian)
  if (arr.length >= 24 && arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e) {
    const width = (arr[16] << 24) | (arr[17] << 16) | (arr[18] << 8) | arr[19];
    const height = (arr[20] << 24) | (arr[21] << 16) | (arr[22] << 8) | arr[23];
    if (width > 0 && height > 0 && width < 0xffff && height < 0xffff) return { width, height };
  }

  // JPEG: find SOF0 (0xFFC0) or SOF1 (0xFFC1) marker; dimensions at offset +5 (height) and +7 (width), big-endian
  if (arr.length >= 10 && arr[0] === 0xff && arr[1] === 0xd8) {
    for (let i = 2; i < arr.length - 9; i++) {
      if (arr[i] === 0xff && (arr[i + 1] === 0xc0 || arr[i + 1] === 0xc1)) {
        const height = (arr[i + 5] << 8) | arr[i + 6];
        const width = (arr[i + 7] << 8) | arr[i + 8];
        if (width > 0 && height > 0) return { width, height };
        break;
      }
      if (arr[i] === 0xff && arr[i + 1] >= 0xc0 && arr[i + 1] <= 0xcf && arr[i + 1] !== 0xc4 && arr[i + 1] !== 0xc8) {
        const height = (arr[i + 5] << 8) | arr[i + 6];
        const width = (arr[i + 7] << 8) | arr[i + 8];
        if (width > 0 && height > 0) return { width, height };
        break;
      }
    }
  }

  // WebP VP8X: RIFF....WEBP VP8X - dimensions at bytes 24-26 (width) and 27-29 (height), 24-bit LE, 1-based
  if (arr.length >= 30 && arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46) {
    if (arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) {
      if (arr[12] === 0x56 && arr[13] === 0x50 && arr[14] === 0x38 && arr[15] === 0x58) {
        const width = 1 + (arr[24] | (arr[25] << 8) | (arr[26] << 16));
        const height = 1 + (arr[27] | (arr[28] << 8) | (arr[29] << 16));
        if (width > 0 && height > 0) return { width, height };
      }
    }
  }

  return null;
}

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

    // SECURITY: Check file size and dimensions BEFORE decode (Image Bomb protection)
    if (blob.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Image file too large. Maximum ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`);
    }
    const dims = await getImageDimensionsFromHeader(blob);
    if (dims) {
      checkDimensions(dims.width, dims.height);
    }

    const opts = { imageOrientation: 'from-image' };
    const bitmap = await createImageBitmap(blob, opts);
    checkDimensions(bitmap.width, bitmap.height);
    return { bitmap, width: bitmap.width, height: bitmap.height, isBitmap: true };
  } catch (err) {
    // SECURITY: Never fall back to loadImageLegacy for large files when parser failed - Image Bomb risk.
    // loadImageLegacy decodes via new Image() before we can check dimensions - 15000x15000 = 900MB OOM.
    const size = (source instanceof Blob || source instanceof File) ? source.size : 0;
    if (size > 1024 * 1024) {
      throw new Error('Image too large or unsupported format. Maximum 1 MB when dimensions cannot be verified.');
    }
    return loadImageLegacy(source);
  }
}

function loadImageLegacy(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.onload = () => {
      checkDimensions(img.naturalWidth, img.naturalHeight);
      resolve({ img, width: img.naturalWidth, height: img.naturalHeight, isBitmap: false });
    };
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
 * @param {boolean} options.returnBlob - If true, returns Blob instead of data URL (saves RAM, use with URL.createObjectURL)
 * @returns {Promise<string|Blob>} - Base64 data URL or Blob of compressed image
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500,
    format = WEBP_SUPPORTED ? 'webp' : 'jpeg',
    timeout = 10000, // 10 second timeout
    returnBlob = false,
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
      const canvas = document.createElement('canvas');
      let loaded = null;
      try {
        loaded = await loadImageWithOrientation(file);
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

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        if (loaded.isBitmap) {
          ctx.drawImage(loaded.bitmap, 0, 0, width, height);
        } else {
          ctx.drawImage(loaded.img, 0, 0, width, height);
        }

        const maxSizeBytes = maxSizeKB * 1024;
        const getBlob = (mimeType, q) =>
          new Promise((res, rej) => {
            canvas.toBlob(res, mimeType, q);
          });

        const compressIteratively = async () => {
          let effectiveMime = mime;
          let minQ = 0.3;
          let maxQ = quality;
          let bestBlob = null;
          for (let i = 0; i < 3; i++) {
            const mid = (minQ + maxQ) / 2;
            let blob;
            try {
              blob = await getBlob(effectiveMime, mid);
            } catch (err) {
              console.warn('toBlob failed, fallback to JPEG:', err);
              effectiveMime = 'image/jpeg';
              blob = await getBlob(effectiveMime, mid);
            }
            if (!blob) break;
            bestBlob = blob;
            if (blob.size <= maxSizeBytes) {
              minQ = mid;
              break;
            }
            maxQ = mid;
          }
          if (!bestBlob) bestBlob = await getBlob('image/jpeg', 0.5);

          if (returnBlob) {
            return bestBlob;
          }
          return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(bestBlob);
          });
        };

        const result = await compressIteratively();
        resolve(result);
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      } finally {
        canvas.width = 0;
        canvas.height = 0;
        if (loaded?.isBitmap && loaded?.bitmap) loaded.bitmap.close();
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
    let bitmap;
    const canvas = document.createElement('canvas');
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      // SECURITY: Check dimensions before decode (Image Bomb protection)
      if (blob.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(`Image too large. Maximum ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`);
      }
      const dims = await getImageDimensionsFromHeader(blob);
      if (dims) checkDimensions(dims.width, dims.height);
      bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
      checkDimensions(bitmap.width, bitmap.height);
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      bitmap = null;
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            canvas.width = 0;
            canvas.height = 0;
            if (!b) {
              reject(new Error('Failed to convert to JPEG'));
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(b);
          },
          'image/jpeg',
          0.85
        );
      });
    } catch {
      /* fallback to Image below */
    } finally {
      if (bitmap) bitmap.close();
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.onload = () => {
      checkDimensions(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
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
