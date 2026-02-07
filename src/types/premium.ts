/**
 * Premium Types
 * Type definitions for premium features and sessions
 */

export interface PremiumSession {
  token: string;
  deviceId: string;
  expiresAt: number;
  isActive: boolean;
  timeRemaining: number; // seconds
}

export interface PremiumTokenPayload {
  sid: string; // session ID
  deviceId: string;
  type: 'premium' | 'restore';
  iat?: number; // issued at
  exp?: number; // expires at
}

export interface PremiumTokenVerification {
  valid: boolean;
  expired?: boolean;
  deviceMismatch?: boolean;
  error?: string;
  payload?: PremiumTokenPayload;
}

export interface PremiumFeatures {
  unlimitedAI: boolean;
  allTemplates: boolean;
  visualEditor: boolean;
  downloadZip: boolean;
  characterConstructor: boolean;
  prioritySupport: boolean;
}

export interface PremiumStatus {
  isPremium: boolean;
  features: PremiumFeatures;
  expiresAt?: number;
  timeRemaining?: number;
}

export interface PremiumPricing {
  amount: number;
  currency: 'CHF';
  duration: number; // hours
  features: string[];
}

export const PREMIUM_DURATION_HOURS = 2;
export const PREMIUM_PRICE_CHF = 10;
