/**
 * Server Configuration
 * Centralizes all configuration constants
 */

const isProduction = process.env.NODE_ENV === 'production';

// Rate Limiting (5 AI generations per 24h per IP)
const AI_RATE_LIMIT = parseInt(process.env.AI_RATE_LIMIT, 10) || 5;
const AI_RATE_WINDOW = 24 * 60 * 60; // 24 hours in seconds
const AI_MAX_CHARS = 470;

// AI Model Configuration
const AI_MODEL_TIMEOUT_MS = parseInt(process.env.AI_MODEL_TIMEOUT_MS, 10) || 12000; // 12 seconds
const AI_MIN_CHARS = parseInt(process.env.AI_MIN_CHARS, 10) || 450;

// Cleanup intervals
const CLEANUP_INTERVAL_MS = parseInt(process.env.CLEANUP_INTERVAL_MS, 10) || 300000; // 5 minutes

// Redis
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

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
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
];

const DEFAULT_ORIGINS_PROD = [
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
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

// Cookie signing secret (required for CSRF signed cookies - prevents token forgery)
const COOKIE_SECRET = process.env.COOKIE_SECRET || (isProduction ? null : 'dev-secret-change-in-production');

module.exports = {
  isProduction,
  AI_RATE_LIMIT,
  AI_RATE_WINDOW,
  AI_MAX_CHARS,
  AI_MODEL_TIMEOUT_MS,
  AI_MIN_CHARS,
  AI_MODELS,
  CLEANUP_INTERVAL_MS,
  REDIS_URL,
  GEMINI_API_KEY,
  ALLOWED_ORIGINS,
  FRONTEND_URL,
  PORT,
  COOKIE_SECRET,
};
