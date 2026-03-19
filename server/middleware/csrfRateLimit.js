/**
 * Rate limiter for /csrf-token endpoint
 * Uses Redis (same as AI rate limit) - LRUCache allows IP spoofing bypass via eviction.
 * Fallback to in-memory only when Redis unavailable (dev mode).
 */

const { getClientIP, getRedisClient, isRedisAvailable } = require('./rateLimit');
const { isProduction } = require('../config');
const { logger } = require('../utils/logger');

const CSRF_TOKEN_WINDOW_SEC = 60;
const CSRF_TOKEN_MAX_PER_IP = 100;

// In-memory fallback for dev (no LRU eviction - use Map with cleanup)
const inMemoryCounts = new Map();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60000;

function cleanupInMemory() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  const cutoff = now - CSRF_TOKEN_WINDOW_SEC * 1000;
  for (const [ip, entry] of inMemoryCounts.entries()) {
    if (entry.firstRequest < cutoff) inMemoryCounts.delete(ip);
  }
}

async function csrfTokenRateLimit(req, res, next) {
  const ip = getClientIP(req);
  const redis = getRedisClient();

  if (redis && isRedisAvailable()) {
    try {
      const key = `csrf_rl:${ip}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, CSRF_TOKEN_WINDOW_SEC);

      if (count > CSRF_TOKEN_MAX_PER_IP) {
        const ttl = await redis.ttl(key);
        return res.status(429).json({
          error: 'Too many requests',
          message: 'Please wait before requesting another token.',
          retryAfter: Math.max(1, ttl),
        });
      }
      return next();
    } catch (err) {
      logger.error('CSRF rate limit Redis error:', err.message);
      if (isProduction) {
        return res.status(503).json({ error: 'Service temporarily unavailable' });
      }
      // Fall through to in-memory for dev
    }
  }

  // In-memory fallback (dev only)
  cleanupInMemory();
  const now = Date.now();
  let entry = inMemoryCounts.get(ip);
  if (!entry || now - entry.firstRequest > CSRF_TOKEN_WINDOW_SEC * 1000) {
    entry = { count: 1, firstRequest: now };
    inMemoryCounts.set(ip, entry);
    return next();
  }
  entry.count++;
  if (entry.count > CSRF_TOKEN_MAX_PER_IP) {
    const retryAfter = Math.ceil((entry.firstRequest + CSRF_TOKEN_WINDOW_SEC * 1000 - now) / 1000);
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please wait before requesting another token.',
      retryAfter: Math.max(1, retryAfter),
    });
  }
  next();
}

module.exports = { csrfTokenRateLimit };
