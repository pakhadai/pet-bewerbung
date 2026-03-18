/**
 * Rate limiter for /csrf-token endpoint
 * Uses LRUCache to prevent memory exhaustion from spoofed IPs.
 */

const { LRUCache } = require('lru-cache');
const { getClientIP } = require('./rateLimit');
const { logger } = require('../utils/logger');

const CSRF_TOKEN_WINDOW_MS = 60 * 1000; // 1 minute
const CSRF_TOKEN_MAX_PER_IP = 100;

const csrfTokenAttempts = new LRUCache({ max: 5000, ttl: CSRF_TOKEN_WINDOW_MS });

function csrfTokenRateLimit(req, res, next) {
  const ip = getClientIP(req);
  const now = Date.now();

  let entry = csrfTokenAttempts.get(ip);
  if (!entry) {
    csrfTokenAttempts.set(ip, { count: 1, firstRequest: now });
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
