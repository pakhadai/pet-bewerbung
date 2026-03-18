/**
 * Input Sanitization Utilities
 * Protects against prompt injection and XSS
 *
 * NOTE: RegEx alone cannot fully prevent prompt injection. This is defense-in-depth:
 * - Sanitization reduces obvious attacks
 * - Gemini systemInstruction enforces role boundaries
 * - Output validation and length limits add further protection
 */

const MAX_FIELD_LENGTH = 100;
const MAX_TRAITS_LENGTH = 300;

// Leetspeak / homoglyph normalization (0->o, 1->i/l, 3->e, 4->a, 5->s, @->a, etc.)
const LEET_MAP = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b',
  '@': 'a', '!': 'i', '|': 'i', '$': 's', '+': 't',
};

function normalizeBypassAttempts(str) {
  let s = str.toLowerCase();
  for (const [char, replacement] of Object.entries(LEET_MAP)) {
    s = s.split(char).join(replacement);
  }
  return s;
}

// Comprehensive patterns for prompt injection prevention
const SUSPICIOUS_PATTERNS = [
  /\b(ignore|forget|disregard|override|bypass|skip)\b/gi,
  /\b(previous|prior|above|earlier)\s+(instruction|prompt|rule|command)/gi,
  /\b(you are|act as|pretend|behave as|roleplay|assume|become)\b/gi,
  /\b(new role|different (role|character|persona|assistant))/gi,
  /\b(system|admin|root|prompt|instruction|rule|command|directive)\b/gi,
  /\b(now (write|tell|say|do|generate|create)|instead (write|tell|say))/gi,
  /\b(original|real|actual)\s+(task|instruction|prompt|purpose)/gi,
  /[\\\/](n|r|t|x[0-9a-f]{2})/gi,
  /(.)\1{4,}/gi,
];

// Check normalized string for bypass attempts (catches "1gn0re", "1gnore", etc.)
const BYPASS_PATTERNS_NORMALIZED = [
  'ignore', 'forget', 'disregard', 'override', 'bypass',
  'instruction', 'prompt', 'system', 'admin', 'root',
  'you are', 'act as', 'pretend', 'roleplay',
];

function containsBypassAfterNormalization(str) {
  const normalized = normalizeBypassAttempts(str);
  return BYPASS_PATTERNS_NORMALIZED.some(p => {
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\b' + escaped + '\\b', 'i').test(normalized);
  });
}

const SUSPICIOUS_CHARS = /[{}\\<>|`$]/g;

/**
 * Strict whitelist sanitization for prompt injection prevention
 * Allows ONLY letters (incl. Cyrillic), digits, spaces, hyphens
 * @param {string} str - Input string
 * @param {number} maxLen - Maximum length
 * @returns {string} Sanitized string
 */
function strictSanitizeAlphaNumeric(str, maxLen = 30) {
  if (!str) return '';
  return String(str)
    .replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9\s\-]/g, '')
    .slice(0, maxLen)
    .trim();
}

/**
 * Sanitize a string field
 * @param {string} str - Input string
 * @param {number} maxLen - Maximum length
 * @returns {string} Sanitized string
 */
function sanitizeString(str, maxLen = MAX_FIELD_LENGTH) {
  if (!str) return '';

  let sanitized = String(str).slice(0, maxLen);

  // Reject entirely if normalized string contains bypass attempts
  if (containsBypassAfterNormalization(sanitized)) {
    return '';
  }

  // Replace suspicious patterns with space (never empty - avoids creating new bypass words like "igignorenore" -> "ignore")
  for (const pattern of SUSPICIOUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, ' ');
  }

  sanitized = sanitized
    .replace(SUSPICIOUS_CHARS, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Re-check after replacements - concatenation may have created new bypass words
  if (containsBypassAfterNormalization(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitize pet data for AI generation
 * Uses strict whitelist for prompt fields to prevent injection
 * @param {Object} petData - Raw pet data
 * @returns {Object} Sanitized pet data
 */
function sanitizePetData(petData) {
  return {
    petName: strictSanitizeAlphaNumeric(petData.petName, 30),
    petType: strictSanitizeAlphaNumeric(petData.petType, 50),
    breed: strictSanitizeAlphaNumeric(petData.breed, 50),
    age: strictSanitizeAlphaNumeric(petData.age, 10),
    gender: ['m', 'f'].includes(petData.gender) ? petData.gender : '',
    weight: strictSanitizeAlphaNumeric(petData.weight, 10),
    traits: sanitizeText(strictSanitizeAlphaNumeric(petData.traits, MAX_TRAITS_LENGTH), MAX_TRAITS_LENGTH),
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

  if (containsBypassAfterNormalization(sanitized)) {
    return '';
  }

  for (const pattern of SUSPICIOUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, ' ');
  }

  sanitized = sanitized
    .replace(SUSPICIOUS_CHARS, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (containsBypassAfterNormalization(sanitized)) {
    return '';
  }

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
  strictSanitizeAlphaNumeric,
  MAX_FIELD_LENGTH,
  MAX_TRAITS_LENGTH,
};
