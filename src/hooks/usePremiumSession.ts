import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TEMPLATE_OPTIONS, PREMIUM_PRICE_CHF } from '../constants';
import API_ENDPOINTS from '../config';

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
  activate: (paymentId: string, deviceId: string, csrfToken?: string | null) => Promise<boolean>;
  /** Clear premium data */
  clear: () => void;
  /** Verify current token with server */
  verifyToken: (deviceId: string, csrfToken?: string | null) => Promise<boolean>;
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
  // Race condition guard for premium activation
  const activatingRef = useRef(false);

  // Load token and expiry from localStorage
  const [premiumToken, setPremiumToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PREMIUM_TOKEN_KEY) || null;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to load premium token from localStorage:', e);
      }
      return null;
    }
  });

  const [tokenExpiry, setTokenExpiry] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(PREMIUM_EXPIRY_KEY);
      return saved ? parseInt(saved, 10) : null;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to load premium expiry from localStorage:', e);
      }
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
      if (import.meta.env.DEV) {
        console.error('Failed to clear premium data from localStorage:', e);
      }
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
  const activatePremium = useCallback(async (paymentId: string, deviceId: string, csrfToken?: string | null): Promise<boolean> => {
    // Race condition guard - prevent multiple simultaneous activations
    if (activatingRef.current) {
      console.warn('Premium activation already in progress');
      return false;
    }

    activatingRef.current = true;
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

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(API_ENDPOINTS.activatePremium, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const expiry = data.expiresAt || (Date.now() + data.expiresIn * 1000);

        try {
          localStorage.setItem(PREMIUM_TOKEN_KEY, data.token);
          localStorage.setItem(PREMIUM_EXPIRY_KEY, String(expiry));
        } catch (e) {
          if (import.meta.env.DEV) {
            console.error('Failed to save premium data to localStorage:', e);
          }
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
        console.error('Premium activation error:', e);
      }
      return false;
    } finally {
      setIsVerifying(false);
      activatingRef.current = false;
    }
  }, []);

  /**
   * Verify current token with server
   */
  const verifyToken = useCallback(async (deviceId: string, csrfToken?: string | null): Promise<boolean> => {
    if (!premiumToken) return false;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(API_ENDPOINTS.verifyPremium, {
        method: 'POST',
        headers,
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
          if (import.meta.env.DEV) {
            console.error('Failed to save updated premium expiry:', e);
          }
        }
      }

      return true;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Premium token verification error:', e);
      }
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
