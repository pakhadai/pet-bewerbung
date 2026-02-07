/**
 * Swiss-specific validation utilities
 */

/**
 * Validates Swiss phone number format
 * Accepts: +41 XX XXX XX XX or +41XXXXXXXXX or 0XX XXX XX XX
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validateSwissPhone = (phone) => {
  if (!phone) return true; // Empty is valid (optional field)

  // Remove all spaces and special characters for validation
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Swiss format: +41 followed by 9 digits OR 0 followed by 9 digits
  // Fixed: Allow any digit after +41 (including area codes like 044, 043, etc.)
  const intlFormat = /^\+41\d{9}$/; // +41791234567 or +41441234567
  const localFormat = /^0\d{9}$/; // 0791234567 or 0441234567

  return intlFormat.test(cleaned) || localFormat.test(cleaned);
};

/**
 * Formats Swiss phone number to standard format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatSwissPhone = (phone) => {
  if (!phone) return '';

  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Convert to international format
  let formatted = cleaned;
  if (cleaned.startsWith('0')) {
    formatted = '+41' + cleaned.substring(1);
  }

  // Format as +41 XX XXX XX XX
  if (formatted.startsWith('+41')) {
    const number = formatted.substring(3);
    if (number.length === 9) {
      return `+41 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
    }
  }

  return phone; // Return original if can't format
};

/**
 * Validates Swiss postal code (PLZ)
 * Format: 1000-9999 (4 digits, first digit 1-9)
 * @param {string} postal - Postal code to validate
 * @returns {boolean} - True if valid
 */
export const validateSwissPostal = (postal) => {
  if (!postal) return true; // Empty is valid (optional field)
  return /^[1-9]\d{3}$/.test(postal);
};

/**
 * Validates email format (RFC 5322 compliant, practical subset)
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  if (!email) return true; // Empty is valid (optional field)

  // More robust email validation:
  // - Requires valid characters in local part
  // - Requires @ symbol
  // - Requires domain with at least one dot
  // - TLD must be at least 2 characters
  const emailPattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Additional checks
  if (!emailPattern.test(email)) return false;

  // Reject emails with consecutive dots or dots at start/end
  if (email.includes('..') || email.startsWith('.') || email.includes('@.') || email.includes('.@')) {
    return false;
  }

  return true;
};

/**
 * Formats Swiss address in standard format
 * @param {string} street - Street name
 * @param {string} number - House number
 * @param {string} postal - Postal code
 * @param {string} city - City name
 * @returns {string} - Formatted address
 */
export const formatSwissAddress = (street, number, postal, city) => {
  const streetLine = [street, number].filter(Boolean).join(' ');
  const cityLine = [postal, city].filter(Boolean).join(' ');
  return [streetLine, cityLine].filter(Boolean).join(', ');
};

/**
 * Gets validation error message for Swiss phone
 * @param {Object} t - Translations object
 * @returns {string} - Error message
 */
export const getPhoneErrorMessage = (t) => {
  return "Format: +41 XX XXX XX XX oder 0XX XXX XX XX";
};

/**
 * Gets validation error message for Swiss postal code
 * @param {Object} t - Translations object
 * @returns {string} - Error message
 */
export const getPostalErrorMessage = (t) => {
  return "PLZ muss 4-stellig sein (1000-9999)";
};

/**
 * Canton codes and their German/French names
 */
export const SWISS_CANTONS = [
  { code: 'ZH', de: 'Zürich', fr: 'Zurich' },
  { code: 'BE', de: 'Bern', fr: 'Berne' },
  { code: 'LU', de: 'Luzern', fr: 'Lucerne' },
  { code: 'UR', de: 'Uri', fr: 'Uri' },
  { code: 'SZ', de: 'Schwyz', fr: 'Schwytz' },
  { code: 'OW', de: 'Obwalden', fr: 'Obwald' },
  { code: 'NW', de: 'Nidwalden', fr: 'Nidwald' },
  { code: 'GL', de: 'Glarus', fr: 'Glaris' },
  { code: 'ZG', de: 'Zug', fr: 'Zoug' },
  { code: 'FR', de: 'Freiburg', fr: 'Fribourg' },
  { code: 'SO', de: 'Solothurn', fr: 'Soleure' },
  { code: 'BS', de: 'Basel-Stadt', fr: 'Bâle-Ville' },
  { code: 'BL', de: 'Basel-Landschaft', fr: 'Bâle-Campagne' },
  { code: 'SH', de: 'Schaffhausen', fr: 'Schaffhouse' },
  { code: 'AR', de: 'Appenzell Ausserrhoden', fr: 'Appenzell Rhodes-Extérieures' },
  { code: 'AI', de: 'Appenzell Innerrhoden', fr: 'Appenzell Rhodes-Intérieures' },
  { code: 'SG', de: 'St. Gallen', fr: 'Saint-Gall' },
  { code: 'GR', de: 'Graubünden', fr: 'Grisons' },
  { code: 'AG', de: 'Aargau', fr: 'Argovie' },
  { code: 'TG', de: 'Thurgau', fr: 'Thurgovie' },
  { code: 'TI', de: 'Tessin', fr: 'Tessin' },
  { code: 'VD', de: 'Waadt', fr: 'Vaud' },
  { code: 'VS', de: 'Wallis', fr: 'Valais' },
  { code: 'NE', de: 'Neuenburg', fr: 'Neuchâtel' },
  { code: 'GE', de: 'Genf', fr: 'Genève' },
  { code: 'JU', de: 'Jura', fr: 'Jura' }
];

/**
 * Canton-specific pet regulations
 */
export const CANTON_PET_RULES = {
  ZH: { requiresAmicus: true, dogTax: true, note: 'Hundesteuer obligatorisch' },
  BE: { requiresAmicus: true, dogTax: true, note: 'AMICUS-Registrierung Pflicht' },
  VD: { requiresAmicus: true, dogTax: true, note: 'Taxe pour chiens obligatoire' },
  GE: { requiresAmicus: true, dogTax: true, note: 'Taxe pour chiens obligatoire' },
  // Add more as needed
};
