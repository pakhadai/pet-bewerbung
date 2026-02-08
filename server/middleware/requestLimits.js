/**
 * Request Size Limits Middleware
 * Prevents DoS attacks via large payloads
 *
 * NOTE: Express body parsers (express.json, express.raw) are configured with:
 * - JSON body: 1mb limit (server/index.js line 77)
 * - Webhook raw body: 2mb limit (server/index.js line 105)
 *
 * This middleware provides additional per-endpoint limits and tracks total bandwidth usage.
 */

const { isProduction } = require('../config');
const { logger } = require('../utils/logger');

// Size limits for different endpoints (in bytes)
const SIZE_LIMITS = {
  // Default limit for most endpoints
  default: 1 * 1024 * 1024, // 1 MB

  // Specific endpoint limits
  '/api/generate-pet-description': 50 * 1024, // 50 KB (text only)
  '/api/improve-text': 100 * 1024, // 100 KB
  '/api/create-checkout-session': 10 * 1024, // 10 KB
  '/api/create-payment-intent': 10 * 1024, // 10 KB
  '/api/activate-premium': 10 * 1024, // 10 KB
  '/webhook': 1 * 1024 * 1024, // 1 MB (Stripe webhooks can be large)
};

/**
 * Check request body size
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function checkRequestSize(req, res, next) {
  // Get size limit for this endpoint
  const limit = SIZE_LIMITS[req.path] || SIZE_LIMITS.default;

  // Check if Content-Length header exists
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);

  if (contentLength > limit) {
    const limitMB = (limit / (1024 * 1024)).toFixed(2);
    const sizeMB = (contentLength / (1024 * 1024)).toFixed(2);

    if (!isProduction) {
      logger.warn(`Request too large: ${sizeMB}MB exceeds ${limitMB}MB limit for ${req.path}`);
    }

    return res.status(413).json({
      error: 'Request payload too large',
      message: `Maximum size: ${limitMB}MB, received: ${sizeMB}MB`,
      limit: limit,
      received: contentLength,
    });
  }

  next();
}

/**
 * Create size limit middleware for specific limit
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Function} Middleware function
 */
function createSizeLimit(maxSize) {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);

    if (contentLength > maxSize) {
      const limitMB = (maxSize / (1024 * 1024)).toFixed(2);
      return res.status(413).json({
        error: 'Request payload too large',
        message: `Maximum size: ${limitMB}MB`,
      });
    }

    next();
  };
}

/**
 * Rate limit by request size (prevent abuse)
 * Tracks total bytes received per IP per hour
 */
const sizeTracker = new Map();
const SIZE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_BYTES_PER_HOUR = 100 * 1024 * 1024; // 100 MB per hour per IP

function trackRequestSize(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.socket.remoteAddress ||
             'unknown';

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  const now = Date.now();

  // Get or create tracker for this IP
  if (!sizeTracker.has(ip)) {
    sizeTracker.set(ip, { bytes: 0, resetTime: now + SIZE_WINDOW_MS });
  }

  const tracker = sizeTracker.get(ip);

  // Reset if window expired
  if (now > tracker.resetTime) {
    tracker.bytes = 0;
    tracker.resetTime = now + SIZE_WINDOW_MS;
  }

  // Check if limit exceeded
  if (tracker.bytes + contentLength > MAX_BYTES_PER_HOUR) {
    const limitMB = (MAX_BYTES_PER_HOUR / (1024 * 1024)).toFixed(0);
    return res.status(429).json({
      error: 'Bandwidth limit exceeded',
      message: `Maximum ${limitMB}MB per hour exceeded. Try again later.`,
      resetTime: new Date(tracker.resetTime).toISOString(),
    });
  }

  // Update tracker
  tracker.bytes += contentLength;

  next();
}

/**
 * Cleanup old trackers periodically
 */
let sizeCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of sizeTracker.entries()) {
    if (now > tracker.resetTime + SIZE_WINDOW_MS) {
      sizeTracker.delete(ip);
    }
  }
}, 15 * 60 * 1000); // Cleanup every 15 minutes

/**
 * Stop cleanup interval (for graceful shutdown)
 */
function stopCleanup() {
  if (sizeCleanupInterval) {
    clearInterval(sizeCleanupInterval);
    sizeCleanupInterval = null;
  }
}

module.exports = {
  checkRequestSize,
  createSizeLimit,
  trackRequestSize,
  stopCleanup,
  SIZE_LIMITS,
};
