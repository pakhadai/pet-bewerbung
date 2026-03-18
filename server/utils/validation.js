/**
 * Validation Utilities
 * Input validation functions for security and data integrity
 */

/**
 * Validate device ID format
 * SECURITY: Requires UUID v4 format for high entropy and brute-force resistance
 * @param {string} deviceId - Device identifier
 * @returns {boolean} True if valid
 */
function validateDeviceId(deviceId) {
  if (!deviceId || typeof deviceId !== 'string') {
    return false;
  }

  // CRITICAL SECURITY: Enforce UUID v4 format (128-bit entropy)
  // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // where x is any hexadecimal digit and y is one of 8, 9, A, or B
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidV4Regex.test(deviceId)) {
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

/**
 * Validate pet data structure for AI generation
 * SECURITY: Enforce types and limits before feeding to LLM
 * @param {Object} petData - Raw pet data from request
 * @returns {{ valid: boolean, error?: string }}
 */
function validatePetData(petData) {
  if (!petData || typeof petData !== 'object') {
    return { valid: false, error: 'Pet data required' };
  }
  if (!petData.petName || typeof petData.petName !== 'string' || petData.petName.trim().length < 2) {
    return { valid: false, error: 'Pet name required (min 2 chars)' };
  }
  const maxLen = 100;
  const strFields = ['petType', 'breed', 'age', 'weight', 'traits'];
  for (const f of strFields) {
    if (petData[f] != null && typeof petData[f] !== 'string') {
      return { valid: false, error: `Invalid type for ${f}` };
    }
    if (petData[f] && String(petData[f]).length > maxLen) {
      return { valid: false, error: `${f} too long` };
    }
  }
  if (petData.gender != null && !['m', 'f', ''].includes(petData.gender)) {
    return { valid: false, error: 'Invalid gender' };
  }
  if (petData.neutered != null && typeof petData.neutered !== 'boolean') {
    return { valid: false, error: 'Invalid neutered' };
  }
  if (petData.vaccinated != null && typeof petData.vaccinated !== 'boolean') {
    return { valid: false, error: 'Invalid vaccinated' };
  }
  return { valid: true };
}

/**
 * Validate lang code for AI generation
 */
function validateLang(lang) {
  const allowed = ['de', 'en', 'fr', 'it', 'ua', 'rm'];
  return typeof lang === 'string' && allowed.includes(lang);
}

module.exports = {
  validateDeviceId,
  validateEmail,
  validateUrl,
  validatePetData,
  validateLang,
};
