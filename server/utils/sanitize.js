/**
 * Input Sanitization Utilities
 * Protects against prompt injection and XSS
 */

const MAX_FIELD_LENGTH = 100;
const MAX_TRAITS_LENGTH = 300;

// Patterns that could be used for prompt injection
const SUSPICIOUS_PATTERNS = /(\bignore\b|\bforget\b|\bpretend\b|\bact as\b|\bsystem\b|\bprompt\b|\binstructions?\b|\bdisregard\b|\boverride\b|\byou are\b|\bnew role\b)/gi;

/**
 * Sanitize a string field
 * @param {string} str - Input string
 * @param {number} maxLen - Maximum length
 * @returns {string} Sanitized string
 */
function sanitizeString(str, maxLen = MAX_FIELD_LENGTH) {
  if (!str) return '';
  return String(str)
    .slice(0, maxLen)
    .replace(SUSPICIOUS_PATTERNS, '')
    .replace(/[<>{}\\]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * Sanitize pet data for AI generation
 * @param {Object} petData - Raw pet data
 * @returns {Object} Sanitized pet data
 */
function sanitizePetData(petData) {
  return {
    petName: sanitizeString(petData.petName, MAX_FIELD_LENGTH),
    petType: sanitizeString(petData.petType, 50),
    breed: sanitizeString(petData.breed, MAX_FIELD_LENGTH),
    age: sanitizeString(petData.age, 10),
    gender: ['m', 'f'].includes(petData.gender) ? petData.gender : '',
    weight: sanitizeString(petData.weight, 10),
    traits: sanitizeString(petData.traits, MAX_TRAITS_LENGTH),
    neutered: Boolean(petData.neutered),
    vaccinated: Boolean(petData.vaccinated),
  };
}

/**
 * Sanitize text for AI improvement
 * @param {string} text - Input text
 * @param {number} maxLen - Maximum length
 * @returns {string} Sanitized text
 */
function sanitizeText(text, maxLen = 1000) {
  if (!text) return '';
  return String(text)
    .slice(0, maxLen)
    .replace(/[<>{}]/g, '')
    .trim();
}

/**
 * Validate and sanitize tone
 * @param {string} tone - Requested tone
 * @returns {string} Valid tone
 */
function sanitizeTone(tone) {
  const validTones = ['formal', 'humorous', 'cute'];
  return validTones.includes(tone) ? tone : 'formal';
}

module.exports = {
  sanitizeString,
  sanitizePetData,
  sanitizeText,
  sanitizeTone,
  MAX_FIELD_LENGTH,
  MAX_TRAITS_LENGTH,
};
