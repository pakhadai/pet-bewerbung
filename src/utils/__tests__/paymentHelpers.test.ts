/**
 * Unit Tests for Payment Helpers
 * Run with: npm test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chfToCents, parsePaymentParams, cleanPaymentUrl } from '../paymentHelpers';

describe('paymentHelpers', () => {
  describe('chfToCents', () => {
    it('should convert CHF to cents correctly', () => {
      expect(chfToCents(10)).toBe(1000);
      expect(chfToCents(5.5)).toBe(550);
      expect(chfToCents(0.01)).toBe(1);
      expect(chfToCents(100)).toBe(10000);
    });

    it('should handle string inputs', () => {
      expect(chfToCents('10')).toBe(1000);
      expect(chfToCents('5.5')).toBe(550);
    });

    it('should round to nearest cent', () => {
      expect(chfToCents(10.555)).toBe(1056); // Rounds up
      expect(chfToCents(10.554)).toBe(1055); // Rounds down
    });

    it('should throw error for invalid amounts', () => {
      expect(() => chfToCents(-10)).toThrow('Invalid amount');
      expect(() => chfToCents(NaN)).toThrow('Invalid amount');
      expect(() => chfToCents('invalid')).toThrow('Invalid amount');
    });

    it('should handle zero', () => {
      expect(() => chfToCents(0)).toThrow('Invalid amount');
    });
  });

  describe('parsePaymentParams', () => {
    beforeEach(() => {
      // Reset window.location
      delete (window as any).location;
      (window as any).location = { search: '' };
    });

    it('should parse payment success params', () => {
      (window as any).location = {
        search: '?session_id=cs_test123&payment_success=true',
      };

      const params = parsePaymentParams();
      expect(params.sessionId).toBe('cs_test123');
      expect(params.paymentSuccess).toBe('true');
      expect(params.paymentCanceled).toBeNull();
      expect(params.restoreToken).toBeNull();
    });

    it('should parse payment canceled params', () => {
      (window as any).location = {
        search: '?payment_canceled=true',
      };

      const params = parsePaymentParams();
      expect(params.paymentCanceled).toBe('true');
      expect(params.sessionId).toBeNull();
    });

    it('should parse restore token', () => {
      (window as any).location = {
        search: '?restore=abc123def',
      };

      const params = parsePaymentParams();
      expect(params.restoreToken).toBe('abc123def');
    });

    it('should return null for missing params', () => {
      (window as any).location = { search: '' };

      const params = parsePaymentParams();
      expect(params.sessionId).toBeNull();
      expect(params.paymentSuccess).toBeNull();
      expect(params.paymentCanceled).toBeNull();
      expect(params.restoreToken).toBeNull();
    });
  });

  describe('cleanPaymentUrl', () => {
    it('should remove payment params from URL', () => {
      const mockReplaceState = vi.fn();
      delete (window as any).history;
      (window as any).history = {
        replaceState: mockReplaceState,
      };
      (window as any).location = {
        pathname: '/app',
      };

      cleanPaymentUrl();

      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        expect.any(String),
        '/app'
      );
    });
  });
});
