/**
 * Sanitization Utilities
 * Security functions for sanitizing user inputs and error messages
 */

/**
 * Sanitize error message to prevent XSS attacks
 * Removes HTML tags, script tags, and potentially dangerous characters
 *
 * @param message - Raw error message string
 * @param maxLength - Maximum allowed length (default: 200)
 * @returns Sanitized error message safe for display
 */
export function sanitizeErrorMessage(message: string, maxLength: number = 200): string {
  if (!message || typeof message !== 'string') {
    return 'An error occurred';
  }

  // Remove all HTML tags and script content
  let sanitized = message
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick=, onerror=, etc.)
    .trim();

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...';
  }

  return sanitized || 'An error occurred';
}

/**
 * Sanitize text input to prevent injection attacks
 * More lenient than error message sanitization, but still removes dangerous content
 *
 * @param text - Raw text input
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns Sanitized text
 */
export function sanitizeTextInput(text: string, maxLength: number = 1000): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove script tags and dangerous patterns
  let sanitized = text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Escape HTML special characters
 * Converts <, >, &, ", ' to HTML entities
 *
 * @param text - Raw text to escape
 * @returns HTML-safe text
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}
