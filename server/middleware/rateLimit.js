/**
 * Rate Limiting Middleware
 * Uses Redis for rate limiting. No fallback - Redis is required for production.
 * In-memory fallback uses LRU cache (O(1)) instead of Map+array (O(N)).
 */

const Redis = require('ioredis');
const { LRUCache } = require('lru-cache');
const {
  isProduction,
  REDIS_URL,
  AI_RATE_LIMIT,
  AI_RATE_WINDOW,
  CLEANUP_INTERVAL_MS
} = require('../config');
const { logger } = require('../utils/logger');

// Redis client
let redis = null;
let redisAvailable = false;

// In-memory fallback: LRU cache O(1) - no indexOf/splice on every request
const MAX_IN_MEMORY_ENTRIES = 10000;
const inMemoryLimiter = new LRUCache({ max: MAX_IN_MEMORY_ENTRIES });

/**
 * Initialize Redis connection
 * @returns {Promise<boolean>} Success status
 */
async function initRedis() {
  try {
    redis = new Redis(REDIS_URL, { 
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('❌ Redis connection failed after 3 retries');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 1000);
      },
      lazyConnect: true,
    });
    
    redis.on('error', (err) => {
      if (redisAvailable) {
        logger.error('❌ Redis connection lost:', err.message);
        redisAvailable = false;
      }
    });
    
    redis.on('connect', () => {
      if (!redisAvailable) {
        logger.info('✅ Redis reconnected');
        redisAvailable = true;
      }
    });
    
    await redis.connect();
    await redis.ping();
    
    redisAvailable = true;
    logger.info('✅ Redis connected');
    return true;
  } catch (err) {
    redisAvailable = false;
    
    if (isProduction) {
      logger.error('❌ CRITICAL: Redis is required in production!');
      logger.error('   Please configure REDIS_URL environment variable.');
      logger.error('   Error:', err.message);
      // In production, exit if Redis is not available
      process.exit(1);
    } else {
      logger.warn('⚠️  Redis unavailable in development mode.');
      logger.warn('   Rate limiting will be DISABLED until Redis is connected.');
      logger.warn('   Start Redis: docker run -d -p 6379:6379 redis:7-alpine');
    }
    
    return false;
  }
}

/**
 * Check rate limit using in-memory LRU storage (O(1), fallback for dev mode)
 */
function checkRateLimitInMemory(ip, limit) {
  const now = Date.now();
  const resetTime = now + AI_RATE_WINDOW * 1000;

  let entry = inMemoryLimiter.get(ip);

  if (!entry || entry.resetTime < now) {
    entry = { count: 1, resetTime };
    inMemoryLimiter.set(ip, entry);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
      inMemory: true
    };
  }

  entry.count++;
  inMemoryLimiter.set(ip, entry);

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime,
    inMemory: true
  };
}

function cleanupInMemoryLimiter() {
  const now = Date.now();
  for (const ip of inMemoryLimiter.keys()) {
    const entry = inMemoryLimiter.get(ip);
    if (entry && entry.resetTime < now) inMemoryLimiter.delete(ip);
  }
}
let memoryCleanupInterval = setInterval(cleanupInMemoryLimiter, CLEANUP_INTERVAL_MS);

// Atomic INCR + EXPIRE (only on first request) to avoid permanent keys on crash
const RATE_LIMIT_SCRIPT = `
  local c = redis.call('INCR', KEYS[1])
  if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return c
`;

/**
 * Check rate limit using Redis
 * @param {string} ip - Client IP
 * @param {number} limit - Request limit
 * @returns {Promise<Object>} Rate limit status
 */
async function checkRateLimitRedis(ip, limit) {
  const key = `ai:ratelimit:${ip}`;
  const count = await redis.eval(RATE_LIMIT_SCRIPT, 1, key, AI_RATE_WINDOW);
  const ttl = await redis.ttl(key);
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetTime: Date.now() + ttl * 1000,
  };
}

/**
 * Check AI rate limit
 * @param {string} ip - Client IP
 * @returns {Promise<Object>} Rate limit status
 */
async function checkAIRateLimit(ip) {
  // If Redis is not available, use in-memory fallback
  if (!redisAvailable || !redis) {
    if (!isProduction) {
      logger.warn(`Using in-memory rate limiting for IP ${ip} (Redis unavailable)`);
      return checkRateLimitInMemory(ip, AI_RATE_LIMIT);
    }
    return {
      allowed: false,
      remaining: 0,
      resetTime: Date.now(),
      error: 'Rate limiting service unavailable'
    };
  }
  return checkRateLimitRedis(ip, AI_RATE_LIMIT);
}

/**
 * Refund a rate limit count (on error)
 * @param {string} ip - Client IP
 */
async function refundRateLimit(ip) {
  if (!redisAvailable || !redis) return;
  
  try {
    const key = `ai:ratelimit:${ip}`;
    const count = await redis.get(key);
    if (count && parseInt(count, 10) > 0) {
      await redis.decr(key);
    }
  } catch (err) {
    logger.error('Rate limit refund error:', err.message);
  }
}

/**
 * Get current rate limit status for an IP
 * @param {string} ip - Client IP
 * @returns {Promise<Object>} Current rate limit info
 */
async function getRateLimitStatus(ip) {
  if (!redisAvailable || !redis) {
    return { 
      limit: AI_RATE_LIMIT, 
      remaining: AI_RATE_LIMIT, 
      resetTime: Date.now() + AI_RATE_WINDOW * 1000,
      redisAvailable: false
    };
  }
  
  try {
    const key = `ai:ratelimit:${ip}`;
    const count = parseInt(await redis.get(key) || '0', 10);
    const ttl = await redis.ttl(key);
    return { 
      limit: AI_RATE_LIMIT, 
      remaining: Math.max(0, AI_RATE_LIMIT - count), 
      resetTime: ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + AI_RATE_WINDOW * 1000,
      redisAvailable: true
    };
  } catch (err) {
    logger.error('Get rate limit status error:', err.message);
    return { 
      limit: AI_RATE_LIMIT, 
      remaining: AI_RATE_LIMIT, 
      resetTime: Date.now() + AI_RATE_WINDOW * 1000,
      redisAvailable: false
    };
  }
}

/**
 * Extract client IP from request
 * SECURITY: Prefer X-Real-IP when Nginx overwrites it (not appends). X-Forwarded-For
 * can be spoofed by clients; Nginx must use proxy_set_header X-Forwarded-For $remote_addr
 * to overwrite, or we use X-Real-IP which Nginx sets to actual client.
 * @param {Object} req - Express request
 * @returns {string} Client IP
 */
function getClientIP(req) {
  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp && typeof xRealIp === 'string') {
    return xRealIp.trim().split(',')[0] || 'unknown';
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Check if Redis is currently available
 * @returns {boolean}
 */
function isRedisAvailable() {
  return redisAvailable;
}

/**
 * Stop cleanup interval (for graceful shutdown)
 */
function stopCleanup() {
  if (memoryCleanupInterval) {
    clearInterval(memoryCleanupInterval);
    memoryCleanupInterval = null;
  }
}

/**
 * Get the Redis client instance (for sharing with other modules like CSRF)
 * @returns {Object|null} Redis client
 */
function getRedisClient() {
  return redisAvailable && redis ? redis : null;
}

/**
 * Close Redis connection (for graceful shutdown)
 * @returns {Promise<void>}
 */
async function closeRedis() {
  stopCleanup();
  if (redis) {
    try {
      await redis.quit();
      redisAvailable = false;
      redis = null;
    } catch (err) {
      logger.error('Error closing Redis connection:', err.message);
    }
  }
}

module.exports = {
  initRedis,
  closeRedis,
  checkAIRateLimit,
  refundRateLimit,
  getRateLimitStatus,
  getClientIP,
  isRedisAvailable,
  getRedisClient,
  stopCleanup,
};
