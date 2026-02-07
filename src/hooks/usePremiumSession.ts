import { useState, useEffect, useMemo, useCallback } from 'react';
import { TEMPLATE_OPTIONS, PREMIUM_PRICE_CHF } from '../constants';

const PREMIUM_TOKEN_KEY = 'pet-bewerbung-premium-token';
const PREMIUM_EXPIRY_KEY = 'pet-bewerbung-premium-expiry';

export interface UsePremiumSessionReturn {
  /** Whether premium is currently active */
  isPremium: boolean;
  /** JWT premium token */
  token: string | null;
  /** Token expiry timestamp */
  expiresAt: number | null;
  /** Time remaining in milliseconds */
  timeRemaining: number;
  /** Premium price in CHF */
  premiumPrice: number;
  /** Whether currently verifying token */
  isVerifying: boolean;
  /** Restore status */
  restoreStatus: string | null;
  /** Activate premium after payment */
  activate: (paymentId: string, deviceId: string) => Promise<boolean>;
  /** Clear premium data */
  clear: () => void;
  /** Verify current token with server */
  verifyToken: (deviceId: string) => Promise<boolean>;
  /** Check if template is accessible (premium check) */
  isTemplateAccessible: (templateId: string) => boolean;
  /** Get template info with premium status */
  getTemplateInfo: (templateId: string) => any;
  /** Check and clear expired tokens */
  checkPremiumExpiry: () => void;
}

/**
 * Premium session management hook with JWT tokens and device binding
 * - 2-hour session duration
 * - Device-bound tokens (can't share with friends)
 * - Server-side verification
 *
 * @returns Premium state and handlers
 */
export const usePremiumSession = (): UsePremiumSessionReturn => {
  // Load token and expiry from localStorage
  const [premiumToken, setPremiumToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PREMIUM_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  });

  const [tokenExpiry, setTokenExpiry] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(PREMIUM_EXPIRY_KEY);
      return saved ? parseInt(saved, 10) : null;
    } catch (e) {
      return null;
    }
  });

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  // Calculate if premium is active (has token and not expired)
  const isPremium = useMemo(() => {
    if (!premiumToken) return false;
    if (tokenExpiry && Date.now() > tokenExpiry) return false;
    return true;
  }, [premiumToken, tokenExpiry]);

  // Time remaining in milliseconds
  const timeRemaining = useMemo(() => {
    if (!isPremium || !tokenExpiry) return 0;
    return Math.max(0, tokenExpiry - Date.now());
  }, [isPremium, tokenExpiry]);

  /**
   * Clear premium data from state and localStorage
   */
  const clearPremium = useCallback(() => {
    try {
      localStorage.removeItem(PREMIUM_TOKEN_KEY);
      localStorage.removeItem(PREMIUM_EXPIRY_KEY);
    } catch (e) {
      // ignore
    }
    setPremiumToken(null);
    setTokenExpiry(null);
  }, []);

  /**
   * Check and clear expired tokens
   */
  const checkPremiumExpiry = useCallback(() => {
    if (tokenExpiry && Date.now() > tokenExpiry) {
      clearPremium();
    }
  }, [tokenExpiry, clearPremium]);

  // Clear expired token on mount and periodically
  useEffect(() => {
    checkPremiumExpiry();
    const interval = setInterval(checkPremiumExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkPremiumExpiry]);

  /**
   * Activate premium after successful payment
   * Accepts either sessionId (Checkout) or paymentIntentId (Payment Elements)
   */
  const activatePremium = useCallback(async (paymentId: string, deviceId: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      // Determine the type of ID and send appropriately
      const body: any = { deviceId };
      if (paymentId?.startsWith('cs_')) {
        body.sessionId = paymentId;
      } else if (paymentId?.startsWith('pi_')) {
        body.paymentIntentId = paymentId;
      } else {
        // Fallback - try both names
        body.sessionId = paymentId;
        body.paymentIntentId = paymentId;
      }

      const response = await fetch('/api/activate-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const expiry = data.expiresAt || (Date.now() + data.expiresIn * 1000);

        try {
          localStorage.setItem(PREMIUM_TOKEN_KEY, data.token);
          localStorage.setItem(PREMIUM_EXPIRY_KEY, String(expiry));
        } catch (e) {
          // ignore
        }

        setPremiumToken(data.token);
        setTokenExpiry(expiry);

        if (import.meta.env.DEV) {
          console.log('✅ Premium activated, expires in:', Math.round(data.expiresIn / 60), 'minutes');
        }

        return true;
      } else {
        if (import.meta.env.DEV) {
          console.warn('Premium activation failed:', data.error);
        }
        return false;
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Premium activation error:', e);
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  /**
   * Verify current token with server
   */
  const verifyToken = useCallback(async (deviceId: string): Promise<boolean> => {
    if (!premiumToken) return false;

    try {
      const response = await fetch('/api/verify-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: premiumToken, deviceId })
      });

      const data = await response.json();

      if (!data.valid) {
        clearPremium();
        return false;
      }

      // Update expiry if server provides it
      if (data.timeRemaining) {
        const newExpiry = Date.now() + data.timeRemaining;
        setTokenExpiry(newExpiry);
        try {
          localStorage.setItem(PREMIUM_EXPIRY_KEY, String(newExpiry));
        } catch (e) {
          // ignore
        }
      }

      return true;
    } catch (e) {
      return false;
    }
  }, [premiumToken, clearPremium]);

  /**
   * Check if selected template requires premium
   */
  const isTemplateAccessible = useCallback((templateId: string): boolean => {
    const template = TEMPLATE_OPTIONS.find(t => t.id === templateId);
    if (!template) return true;
    if (!template.isPremium) return true;
    return isPremium;
  }, [isPremium]);

  /**
   * Get template info with premium status
   */
  const getTemplateInfo = useCallback((templateId: string) => {
    const template = TEMPLATE_OPTIONS.find(t => t.id === templateId);
    if (!template) return { isPremium: false, price: 0, accessible: true };
    return {
      ...template,
      accessible: !template.isPremium || isPremium
    };
  }, [isPremium]);

  return {
    isPremium,
    token: premiumToken,
    expiresAt: tokenExpiry,
    timeRemaining,
    premiumPrice: PREMIUM_PRICE_CHF,
    isVerifying,
    restoreStatus,
    activate: activatePremium,
    clear: clearPremium,
    verifyToken,
    isTemplateAccessible,
    getTemplateInfo,
    checkPremiumExpiry
  };
};
