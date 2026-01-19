// API Configuration
// In production (Docker), requests go through nginx at /api/
// In development, requests go directly to backend at localhost:4242

const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;

// Base URL for API
const API_BASE = isDevelopment 
  ? 'http://localhost:4242'  // Direct to backend in dev
  : '/api';                   // Through nginx in production

export const API_ENDPOINTS = {
  // Stripe
  createCheckoutSession: `${API_BASE}/create-checkout-session`,
  createPaymentIntent: `${API_BASE}/create-payment-intent`,
  stripeConfig: `${API_BASE}/stripe-config`,
  paymentStatus: (id) => `${API_BASE}/payment-status/${id}`,
  checkoutSession: (id) => `${API_BASE}/checkout-session/${id}`,
  
  // AI
  generatePetDescription: `${API_BASE}/generate-pet-description`,
  aiRateLimit: `${API_BASE}/ai-rate-limit`,
};

// Legacy export
export const STRIPE_API_URL = API_BASE;

export default API_ENDPOINTS;
