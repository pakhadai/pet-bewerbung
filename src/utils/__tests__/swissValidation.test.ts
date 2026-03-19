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
      expect(validateSwissPhone('+41791234567')).toBe(true);
      expect(validateSwissPhone('+41 79 123 45 67')).toBe(true);
      expect(validateSwissPhone('+41-79-123-45-67')).toBe(true);
      expect(validateSwissPhone('0791234567')).toBe(true);
      expect(validateSwissPhone('079 123 45 67')).toBe(true);
      expect(validateSwissPhone('+41441234567')).toBe(true);
      expect(validateSwissPhone('+41431234567')).toBe(true);
      expect(validateSwissPhone('0441234567')).toBe(true);
      expect(validateSwissPhone('0431234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validateSwissPhone('123')).toBe(false);
      expect(validateSwissPhone('+41 12 345')).toBe(false);
      expect(validateSwissPhone('00791234567')).toBe(false);
      expect(validateSwissPhone('+42791234567')).toBe(false);
      expect(validateSwissPhone('791234567')).toBe(false);
    });

    it('should accept empty values', () => {
      expect(validateSwissPhone('')).toBe(true);
      expect(validateSwissPhone(null)).toBe(true);
      expect(validateSwissPhone(undefined)).toBe(true);
    });
  });

  describe('validateSwissPostal', () => {
    it('should accept valid Swiss postal codes', () => {
      expect(validateSwissPostal('8000')).toBe(true);
      expect(validateSwissPostal('1000')).toBe(true);
      expect(validateSwissPostal('3000')).toBe(true);
      expect(validateSwissPostal('9999')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(validateSwissPostal('0000')).toBe(false);
      expect(validateSwissPostal('123')).toBe(false);
      expect(validateSwissPostal('12345')).toBe(false);
      expect(validateSwissPostal('abcd')).toBe(false);
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
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test..name@example.com')).toBe(false);
      expect(validateEmail('test@example..com')).toBe(false);
      expect(validateEmail('.test@example.com')).toBe(false);
      expect(validateEmail('test.@example.com')).toBe(false);
      expect(validateEmail('test@.example.com')).toBe(false);
      expect(validateEmail('test@example.c')).toBe(false);
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
