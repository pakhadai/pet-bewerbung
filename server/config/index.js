/**
 * Server Configuration
 * Centralizes all configuration constants
 */

const isProduction = process.env.NODE_ENV === 'production';

// JWT Configuration - CRITICAL: Must be set in ALL environments
// NOTE: Using console.error here instead of logger to avoid circular dependency
// (config is imported by logger, so logger can't be used here)
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is REQUIRED in ALL environments!');
  console.error('   Generate a secure secret: openssl rand -base64 32');
  console.error('   Add to .env file: JWT_SECRET=your_generated_secret');
  process.exit(1);
}
if (isProduction && !process.env.STRIPE_WEBHOOK_SECRET) {
  console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET environment variable is required in production!');
  process.exit(1);
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const PREMIUM_DURATION_HOURS = parseInt(process.env.PREMIUM_DURATION_HOURS, 10) || 2;

// Rate Limiting
const AI_RATE_LIMIT = parseInt(process.env.AI_RATE_LIMIT, 10) || 3;
const AI_RATE_LIMIT_FREE = parseInt(process.env.AI_RATE_LIMIT_FREE, 10) || 1;
const AI_RATE_WINDOW = 24 * 60 * 60; // 24 hours in seconds
const AI_MAX_CHARS = 470;

// AI Model Configuration
const AI_MODEL_TIMEOUT_MS = parseInt(process.env.AI_MODEL_TIMEOUT_MS, 10) || 12000; // 12 seconds
const AI_MIN_CHARS = parseInt(process.env.AI_MIN_CHARS, 10) || 450;

// Cleanup intervals
const CLEANUP_INTERVAL_MS = parseInt(process.env.CLEANUP_INTERVAL_MS, 10) || 300000; // 5 minutes

// Redis
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// AI Models (fallback chain)
// Note: gemma models don't support systemInstruction, only use Gemini models
const AI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
];

// CORS Origins
const DEFAULT_ORIGINS_DEV = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
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
  AI_MODEL_TIMEOUT_MS,
  AI_MIN_CHARS,
  AI_MODELS,
  CLEANUP_INTERVAL_MS,
  REDIS_URL,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
  GEMINI_API_KEY,
  ALLOWED_ORIGINS,
  FRONTEND_URL,
  PORT,
};
