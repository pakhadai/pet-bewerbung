/**
 * Image compression utility
 * Compresses images client-side before storing to state
 */

/**
 * Compresses an image file and returns a base64 data URL
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 800)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 800)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @param {number} options.maxSizeKB - Target max file size in KB (default: 500)
 * @returns {Promise<string>} - Base64 data URL of compressed image
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to meet size target
        let currentQuality = quality;
        let result = canvas.toDataURL('image/jpeg', currentQuality);

        // Iteratively reduce quality if file is still too large
        const maxSizeBytes = maxSizeKB * 1024;
        let iterations = 0;
        const maxIterations = 5;

        while (getBase64Size(result) > maxSizeBytes && currentQuality > 0.3 && iterations < maxIterations) {
          currentQuality -= 0.1;
          result = canvas.toDataURL('image/jpeg', currentQuality);
          iterations++;
        }

        resolve(result);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};

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
