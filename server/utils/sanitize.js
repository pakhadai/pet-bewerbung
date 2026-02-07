/**
 * Input Sanitization Utilities
 * Protects against prompt injection and XSS
 */

const MAX_FIELD_LENGTH = 100;
const MAX_TRAITS_LENGTH = 300;

// Comprehensive patterns for prompt injection prevention
// Covers: command injections, role manipulation, instruction overrides
const SUSPICIOUS_PATTERNS = [
  // Command/instruction manipulation
  /\b(ignore|forget|disregard|override|bypass|skip)\b/gi,
  /\b(previous|prior|above|earlier)\s+(instruction|prompt|rule|command)/gi,

  // Role manipulation
  /\b(you are|act as|pretend|behave as|roleplay|assume|become)\b/gi,
  /\b(new role|different (role|character|persona|assistant))/gi,

  // System/prompt access attempts
  /\b(system|admin|root|prompt|instruction|rule|command|directive)\b/gi,

  // Direct instruction patterns
  /\b(now (write|tell|say|do|generate|create)|instead (write|tell|say))/gi,

  // Meta-instructions
  /\b(original|real|actual)\s+(task|instruction|prompt|purpose)/gi,

  // Encoding bypass attempts (basic)
  /[\\\/](n|r|t|x[0-9a-f]{2})/gi, // Escape sequences

  // Repetition attacks (more than 3 repeated chars)
  /(.)\1{4,}/gi,
];

// Additional suspicious characters that could be used for injection
const SUSPICIOUS_CHARS = /[{}\\<>|`$]/g;

/**
 * Sanitize a string field
 * @param {string} str - Input string
 * @param {number} maxLen - Maximum length
 * @returns {string} Sanitized string
 */
function sanitizeString(str, maxLen = MAX_FIELD_LENGTH) {
  if (!str) return '';

  let sanitized = String(str).slice(0, maxLen);

  // Apply all suspicious pattern removals
  for (const pattern of SUSPICIOUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove suspicious characters
  sanitized = sanitized
    .replace(SUSPICIOUS_CHARS, '')
    .replace(/\n+/g, ' ')  // Replace newlines with spaces
    .replace(/\s{2,}/g, ' ')  // Collapse multiple spaces
    .trim();

  return sanitized;
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
 * Sanitize text for AI improvement (more lenient than sanitizeString)
 * @param {string} text - Input text
 * @param {number} maxLen - Maximum length
 * @returns {string} Sanitized text
 */
function sanitizeText(text, maxLen = 1000) {
  if (!text) return '';

  let sanitized = String(text).slice(0, maxLen);

  // Apply suspicious pattern removals
  for (const pattern of SUSPICIOUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove dangerous characters
  sanitized = sanitized
    .replace(SUSPICIOUS_CHARS, '')
    .replace(/\s{2,}/g, ' ')  // Collapse multiple spaces
    .trim();

  return sanitized;
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
