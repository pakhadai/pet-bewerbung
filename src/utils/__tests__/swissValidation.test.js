/**
 * Unit Tests for Swiss Validation Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateSwissPhone,
  validateSwissPostal,
  validateEmail,
  formatSwissPhone,
} from '../swissValidation';

describe('swissValidation', () => {
  describe('validateSwissPhone', () => {
    it('should accept valid Swiss phone numbers', () => {
      // International format
      expect(validateSwissPhone('+41791234567')).toBe(true);
      expect(validateSwissPhone('+41 79 123 45 67')).toBe(true);
      expect(validateSwissPhone('+41-79-123-45-67')).toBe(true);

      // Local format
      expect(validateSwissPhone('0791234567')).toBe(true);
      expect(validateSwissPhone('079 123 45 67')).toBe(true);

      // Zürich area codes (044, 043)
      expect(validateSwissPhone('+41441234567')).toBe(true);
      expect(validateSwissPhone('+41431234567')).toBe(true);
      expect(validateSwissPhone('0441234567')).toBe(true);
      expect(validateSwissPhone('0431234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validateSwissPhone('123')).toBe(false);
      expect(validateSwissPhone('+41 12 345')).toBe(false);
      expect(validateSwissPhone('00791234567')).toBe(false); // Wrong prefix
      expect(validateSwissPhone('+42791234567')).toBe(false); // Wrong country code
      expect(validateSwissPhone('791234567')).toBe(false); // Missing prefix
    });

    it('should accept empty values', () => {
      expect(validateSwissPhone('')).toBe(true);
      expect(validateSwissPhone(null)).toBe(true);
      expect(validateSwissPhone(undefined)).toBe(true);
    });
  });

  describe('validateSwissPostal', () => {
    it('should accept valid Swiss postal codes', () => {
      expect(validateSwissPostal('8000')).toBe(true); // Zürich
      expect(validateSwissPostal('1000')).toBe(true); // Lausanne
      expect(validateSwissPostal('3000')).toBe(true); // Bern
      expect(validateSwissPostal('9999')).toBe(true); // Valid range
    });

    it('should reject invalid postal codes', () => {
      expect(validateSwissPostal('0000')).toBe(false); // Starts with 0
      expect(validateSwissPostal('123')).toBe(false); // Too short
      expect(validateSwissPostal('12345')).toBe(false); // Too long
      expect(validateSwissPostal('abcd')).toBe(false); // Letters
    });

    it('should accept empty values', () => {
      expect(validateSwissPostal('')).toBe(true);
      expect(validateSwissPostal(null)).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
      expect(validateEmail('user_name@example-domain.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      // Missing parts
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test')).toBe(false);

      // Consecutive dots
      expect(validateEmail('test..name@example.com')).toBe(false);
      expect(validateEmail('test@example..com')).toBe(false);

      // Dots at wrong positions
      expect(validateEmail('.test@example.com')).toBe(false);
      expect(validateEmail('test.@example.com')).toBe(false);
      expect(validateEmail('test@.example.com')).toBe(false);

      // Invalid TLD
      expect(validateEmail('test@example.c')).toBe(false); // TLD too short

      // Old bugs that should now be caught
      expect(validateEmail('test@..')).toBe(false);
    });

    it('should accept empty values', () => {
      expect(validateEmail('')).toBe(true);
      expect(validateEmail(null)).toBe(true);
    });
  });

  describe('formatSwissPhone', () => {
    it('should format phone numbers correctly', () => {
      expect(formatSwissPhone('0791234567')).toBe('+41 79 123 45 67');
      expect(formatSwissPhone('+41791234567')).toBe('+41 79 123 45 67');
      expect(formatSwissPhone('079 123 45 67')).toBe('+41 79 123 45 67');
    });

    it('should return original for invalid formats', () => {
      expect(formatSwissPhone('123')).toBe('123');
      expect(formatSwissPhone('')).toBe('');
    });
  });
});
