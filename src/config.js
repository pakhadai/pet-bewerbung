// API Configuration
// Always use /api – Vite proxies to backend in dev, nginx proxies in production
const API_BASE = '/api';

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
