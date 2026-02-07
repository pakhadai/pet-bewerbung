/**
 * Payment Helper Functions
 * Extracted from App.tsx for better maintainability
 */

import { API_ENDPOINTS } from '../config';

export interface CheckoutSessionParams {
  amount: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
  paymentMethod?: 'card' | 'twint';
}

export interface CheckoutSessionResponse {
  url?: string;
  sessionId?: string;
  error?: string;
  details?: string;
  type?: string;
  code?: string;
}

/**
 * Creates a Stripe checkout session
 * @param params - Checkout session parameters
 * @returns Session URL and ID or error
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResponse> {
  const {
    amount,
    currency = 'chf',
    successUrl = window.location.href,
    cancelUrl = window.location.href,
    paymentMethod = 'card',
  } = params;

  const res = await fetch(API_ENDPOINTS.createCheckoutSession, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      currency,
      successUrl,
      cancelUrl,
      payment_method: paymentMethod,
    }),
  });

  // Check if response is OK
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Server error (${res.status})`;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorJson.details || errorMessage;

      if (import.meta.env.DEV) {
        console.error('Checkout session error:', {
          status: res.status,
          error: errorJson.error,
          details: errorJson.details,
          type: errorJson.type,
          code: errorJson.code,
        });
      }

      return { error: errorMessage, ...errorJson };
    } catch {
      errorMessage = errorText.substring(0, 100) || errorMessage;
      if (import.meta.env.DEV) {
        console.error('Checkout session error (non-JSON):', res.status, errorText.substring(0, 200));
      }
      return { error: errorMessage };
    }
  }

  // Check content type
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    if (import.meta.env.DEV) {
      console.error('Non-JSON response:', text.substring(0, 200));
    }
    return { error: 'Payment error: Server returned HTML instead of JSON. Check API connection.' };
  }

  const json = await res.json();
  return json;
}

/**
 * Parse URL parameters for payment status
 * @returns Payment status parameters
 */
export function parsePaymentParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    sessionId: urlParams.get('session_id'),
    paymentSuccess: urlParams.get('payment_success'),
    paymentCanceled: urlParams.get('payment_canceled'),
    restoreToken: urlParams.get('restore'),
  };
}

/**
 * Clean payment parameters from URL
 */
export function cleanPaymentUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

/**
 * Convert CHF amount to cents
 * @param chf - Amount in CHF
 * @returns Amount in cents (Rappen)
 */
export function chfToCents(chf: number | string): number {
  const amount = typeof chf === 'string' ? parseFloat(chf) : chf;
  if (isNaN(amount) || amount < 0) {
    throw new Error('Invalid amount');
  }
  return Math.round(amount * 100);
}
