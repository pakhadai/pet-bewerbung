/**
 * Validation Utilities
 * Input validation functions for security and data integrity
 */

/**
 * Validate device ID format
 * @param {string} deviceId - Device identifier
 * @returns {boolean} True if valid
 */
function validateDeviceId(deviceId) {
  if (!deviceId || typeof deviceId !== 'string') {
    return false;
  }

  // Check length (UUID v4 is 36 chars, but allow custom formats 10-64 chars)
  if (deviceId.length < 10 || deviceId.length > 64) {
    return false;
  }

  // Only allow alphanumeric characters and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(deviceId)) {
    return false;
  }

  return true;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

module.exports = {
  validateDeviceId,
  validateEmail,
  validateUrl,
};
