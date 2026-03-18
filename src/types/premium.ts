/**
 * Premium Session Types
 * Kept for API compatibility — usePremiumSession always returns isPremium: true
 * All templates are free, no payment required
 */

export interface UsePremiumSessionReturn {
  isPremium: boolean;
  token: string | null;
  expiresAt: number | null;
  timeRemaining: number;
  premiumPrice: number;
  isVerifying: boolean;
  restoreStatus: string | null;
  activate: (paymentId: string, deviceId: string) => Promise<boolean>;
  clear: () => void;
  verifyToken: (deviceId: string) => Promise<boolean>;
  isTemplateAccessible: (templateId: string) => boolean;
  getTemplateInfo: (templateId: string) => any;
  checkPremiumExpiry: () => void;
}
