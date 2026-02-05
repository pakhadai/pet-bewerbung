/**
 * Server Configuration
 * Centralizes all configuration constants
 */

const isProduction = process.env.NODE_ENV === 'production';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars!'
);
const PREMIUM_DURATION_HOURS = parseInt(process.env.PREMIUM_DURATION_HOURS, 10) || 2;

// Rate Limiting
const AI_RATE_LIMIT = parseInt(process.env.AI_RATE_LIMIT, 10) || 3;
const AI_RATE_LIMIT_FREE = parseInt(process.env.AI_RATE_LIMIT_FREE, 10) || 1;
const AI_RATE_WINDOW = 24 * 60 * 60; // 24 hours in seconds
const AI_MAX_CHARS = 470;

// Redis
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// AI Models (fallback chain)
const AI_MODELS = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
  'gemma-3-27b-it',
];

// CORS Origins
const DEFAULT_ORIGINS_DEV = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'https://pet.ohmyrevit.pp.ua',
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
];

const DEFAULT_ORIGINS_PROD = [
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
  'https://pet.ohmyrevit.pp.ua',
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const ALLOWED_ORIGINS = isProduction
  ? (envOrigins.length > 0 ? envOrigins : DEFAULT_ORIGINS_PROD)
  : (envOrigins.length > 0 ? envOrigins : DEFAULT_ORIGINS_DEV);

// Frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pet-bewerbung.ch';

// Server Port
const PORT = process.env.PORT || 4242;

module.exports = {
  isProduction,
  JWT_SECRET,
  PREMIUM_DURATION_HOURS,
  AI_RATE_LIMIT,
  AI_RATE_LIMIT_FREE,
  AI_RATE_WINDOW,
  AI_MAX_CHARS,
  AI_MODELS,
  REDIS_URL,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
  GEMINI_API_KEY,
  ALLOWED_ORIGINS,
  FRONTEND_URL,
  PORT,
};
