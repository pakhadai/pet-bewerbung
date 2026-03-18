/**
 * Rate Limiting Middleware
 * Uses Redis for rate limiting. No fallback - Redis is required for production.
 */

const Redis = require('ioredis');
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

// In-memory fallback rate limiter for development
// Map structure: { ip: { count: number, resetTime: number } }
const inMemoryLimiter = new Map();

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
 * Check rate limit using in-memory storage (fallback for dev mode)
 * @param {string} ip - Client IP
 * @param {number} limit - Request limit
 * @returns {Object} Rate limit status
 */
function checkRateLimitInMemory(ip, limit) {
  const now = Date.now();
  const resetTime = now + AI_RATE_WINDOW * 1000;

  // Get or create entry for this IP
  let entry = inMemoryLimiter.get(ip);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = { count: 1, resetTime };
    inMemoryLimiter.set(ip, entry);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
      inMemory: true
    };
  }

  // Increment counter
  entry.count++;
  inMemoryLimiter.set(ip, entry);

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime,
    inMemory: true
  };
}

/**
 * Cleanup expired in-memory entries (run periodically)
 */
function cleanupInMemoryLimiter() {
  const now = Date.now();
  for (const [ip, entry] of inMemoryLimiter.entries()) {
    if (entry.resetTime < now) {
      inMemoryLimiter.delete(ip);
    }
  }
}

// Run cleanup periodically (store reference for graceful shutdown)
let memoryCleanupInterval = setInterval(cleanupInMemoryLimiter, CLEANUP_INTERVAL_MS);

/**
 * Check rate limit using Redis
 * @param {string} ip - Client IP
 * @param {number} limit - Request limit
 * @returns {Promise<Object>} Rate limit status
 */
async function checkRateLimitRedis(ip, limit) {
  const key = `ai:ratelimit:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, AI_RATE_WINDOW);
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
 * @param {Object} req - Express request
 * @returns {string} Client IP
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.socket.remoteAddress || 
         'unknown';
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
