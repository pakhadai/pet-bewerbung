/**
 * Rate limiter for /csrf-token endpoint
 * Prevents Redis/memory DoS: attackers sending 10k req/s without cookies
 * create new sessions each time. Limit: 100 req/min per IP.
 */

const { getClientIP } = require('./rateLimit');
const { logger } = require('../utils/logger');

const CSRF_TOKEN_WINDOW_MS = 60 * 1000; // 1 minute
const CSRF_TOKEN_MAX_PER_IP = 100;

// In-memory: IP -> { count, firstRequest }
const csrfTokenAttempts = new Map();

function cleanupCsrfAttempts() {
  const now = Date.now();
  for (const [ip, entry] of csrfTokenAttempts.entries()) {
    if (now - entry.firstRequest > CSRF_TOKEN_WINDOW_MS) {
      csrfTokenAttempts.delete(ip);
    }
  }
}
setInterval(cleanupCsrfAttempts, 60000);

/**
 * Rate limit middleware for CSRF token endpoint
 */
function csrfTokenRateLimit(req, res, next) {
  const ip = getClientIP(req);
  const now = Date.now();

  let entry = csrfTokenAttempts.get(ip);
  if (!entry || now - entry.firstRequest > CSRF_TOKEN_WINDOW_MS) {
    entry = { count: 1, firstRequest: now };
    csrfTokenAttempts.set(ip, entry);
    return next();
  }

  entry.count++;
  if (entry.count > CSRF_TOKEN_MAX_PER_IP) {
    logger.warn(`CSRF token rate limit exceeded for IP ${ip}`);
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please wait before requesting another token.',
      retryAfter: Math.ceil((entry.firstRequest + CSRF_TOKEN_WINDOW_MS - now) / 1000),
    });
  }
  next();
}

module.exports = { csrfTokenRateLimit };
