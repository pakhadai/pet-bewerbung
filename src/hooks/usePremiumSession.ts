import { useCallback } from 'react';
import { TEMPLATE_OPTIONS } from '../constants';

export interface UsePremiumSessionReturn {
  isPremium: boolean;
  token: string | null;
  expiresAt: number | null;
  timeRemaining: number;
  premiumPrice: number;
  isVerifying: boolean;
  restoreStatus: string | null;
  activate: (paymentId: string, deviceId: string, csrfToken?: string | null) => Promise<boolean>;
  clear: () => void;
  verifyToken: (deviceId: string, csrfToken?: string | null) => Promise<boolean>;
  isTemplateAccessible: (templateId: string) => boolean;
  getTemplateInfo: (templateId: string) => any;
  checkPremiumExpiry: () => void;
}

/**
 * Simplified premium hook - all features are free
 * Kept for API compatibility with components
 */
export const usePremiumSession = (): UsePremiumSessionReturn => {
  const getTemplateInfo = useCallback((templateId: string) => {
    const template = TEMPLATE_OPTIONS.find(t => t.id === templateId);
    if (!template) return { isPremium: false, price: 0, accessible: true };
    return { ...template, isPremium: false, price: 0, accessible: true };
  }, []);

  const isTemplateAccessible = useCallback(() => true, []);

  return {
    isPremium: true,
    token: null,
    expiresAt: null,
    timeRemaining: 0,
    premiumPrice: 0,
    isVerifying: false,
    restoreStatus: null,
    activate: async () => true,
    clear: () => {},
    verifyToken: async () => true,
    isTemplateAccessible,
    getTemplateInfo,
    checkPremiumExpiry: () => {}
  };
};
