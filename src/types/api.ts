/**
 * API Types
 * Request and response type definitions for all API endpoints
 */

import { Language, PetData, TemplateType } from './form';

// ============================================================================
// AI Generation API
// ============================================================================

export interface AIGenerationRequest {
  petData: Partial<PetData>;
  tone?: 'professional' | 'friendly' | 'formal' | 'casual';
  length?: 'short' | 'medium' | 'long';
  language: Language;
  isPremium: boolean;
  templateType?: TemplateType;
}

export interface AIGenerationResponse {
  success: boolean;
  text?: string;
  error?: string;
  remaining?: number;
  resetTime?: number;
}

export interface AIImproveRequest {
  currentText: string;
  language: Language;
  tone?: 'professional' | 'friendly' | 'formal' | 'casual';
}

export interface AIImproveResponse {
  success: boolean;
  improvedText?: string;
  error?: string;
}

export interface AIRateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  premium: boolean;
}

// ============================================================================
// Payment API
// ============================================================================

export interface StripeConfigResponse {
  publishableKey: string;
}

export interface CreateCheckoutSessionRequest {
  amount: number;
  currency: string;
  deviceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  deviceId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  amount?: number;
  currency?: string;
  deviceId?: string;
}

// ============================================================================
// Premium API
// ============================================================================

export interface ActivatePremiumRequest {
  sessionId: string;
  deviceId: string;
}

export interface ActivatePremiumResponse {
  success: boolean;
  token?: string;
  expiresAt?: number;
  error?: string;
}

export interface GenerateRestoreLinkRequest {
  email: string;
  deviceId: string;
}

export interface GenerateRestoreLinkResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface VerifyRestoreRequest {
  token: string;
}

export interface VerifyRestoreResponse {
  valid: boolean;
  premiumToken?: string;
  expiresAt?: number;
  deviceId?: string;
  error?: string;
}

// ============================================================================
// CSRF API
// ============================================================================

export interface CSRFTokenResponse {
  csrfToken: string;
}

// ============================================================================
// Webhook Events
// ============================================================================

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

// ============================================================================
// Error Response
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  details?: any;
}

// ============================================================================
// Generic API Response
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
