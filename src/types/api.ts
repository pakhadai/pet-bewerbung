/**
 * API Types
 * Request and response type definitions for all API endpoints
 */

import { Language, PetData } from './form';

// ============================================================================
// AI Generation API
// ============================================================================

export interface AIGenerationRequest {
  petData: Partial<PetData>;
  lang: Language;
  tone?: 'formal' | 'humorous' | 'cute';
}

export interface AIGenerationResponse {
  description: string;
  length: number;
  remaining: number;
  resetTime: number;
  model?: string;
}

export interface AIRateLimitStatus {
  limit: number;
  remaining: number;
  resetTime: number;
  redisAvailable: boolean;
  configured: boolean;
}

// ============================================================================
// CSRF API
// ============================================================================

export interface CSRFTokenResponse {
  csrfToken: string;
}

// ============================================================================
// Error & Generic Responses
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
