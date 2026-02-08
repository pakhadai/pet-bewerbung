// API Configuration
// Always use /api – Vite proxies to backend in dev, nginx proxies in production
const API_BASE = '/api';

// Image Compression Configuration
export const IMAGE_COMPRESSION = {
  MAX_WIDTH: 800,
  MAX_HEIGHT: 800,
  QUALITY: 0.8,
  MAX_SIZE_KB: 500
};

export const API_ENDPOINTS = {
  // Security
  csrfToken: `${API_BASE}/csrf-token`,

  // Stripe
  createCheckoutSession: `${API_BASE}/create-checkout-session`,
  createPaymentIntent: `${API_BASE}/create-payment-intent`,
  stripeConfig: `${API_BASE}/stripe-config`,
  paymentStatus: (id) => `${API_BASE}/payment-status/${id}`,
  checkoutSession: (id) => `${API_BASE}/checkout-session/${id}`,

  // Premium
  activatePremium: `${API_BASE}/activate-premium`,
  verifyPremium: `${API_BASE}/verify-premium`,

  // Premium Restoration
  verifyRestore: (token) => `${API_BASE}/verify-restore/${token}`,
  generateRestoreLink: `${API_BASE}/generate-restore-link`,

  // AI
  generatePetDescription: `${API_BASE}/generate-pet-description`,
  improveText: `${API_BASE}/improve-text`,
  aiRateLimit: `${API_BASE}/ai-rate-limit`,
};

export default API_ENDPOINTS;
