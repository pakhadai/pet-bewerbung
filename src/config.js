// API Configuration
const API_CONFIG = {
  development: {
    STRIPE_API_URL: 'http://localhost:4242',
  },
  production: {
    STRIPE_API_URL: import.meta.env.VITE_STRIPE_API_URL || 'http://localhost:4242',
  }
};

// Визначаємо середовище
const ENV = import.meta.env.MODE || 'development';
const isDevelopment = ENV === 'development';

// Експортуємо конфігурацію для поточного середовища
export const STRIPE_API_URL = API_CONFIG[ENV]?.STRIPE_API_URL || API_CONFIG.development.STRIPE_API_URL;

export const API_ENDPOINTS = {
  createCheckoutSession: `${STRIPE_API_URL}/create-checkout-session`,
  createPaymentIntent: `${STRIPE_API_URL}/create-payment-intent`,
  stripeConfig: `${STRIPE_API_URL}/stripe-config`,
  paymentStatus: (id) => `${STRIPE_API_URL}/payment-status/${id}`,
};

export default API_ENDPOINTS;
