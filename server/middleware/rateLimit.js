/**
 * Rate Limiting Middleware
 * Uses Redis for rate limiting. No fallback - Redis is required for production.
 */

const Redis = require('ioredis');
const { 
  isProduction, 
  REDIS_URL, 
  AI_RATE_LIMIT_FREE, 
  AI_RATE_WINDOW 
} = require('../config');

// Redis client
let redis = null;
let redisAvailable = false;

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
          console.error('❌ Redis connection failed after 3 retries');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 1000);
      },
      lazyConnect: true,
    });
    
    redis.on('error', (err) => {
      if (redisAvailable) {
        console.error('❌ Redis connection lost:', err.message);
        redisAvailable = false;
      }
    });
    
    redis.on('connect', () => {
      if (!redisAvailable) {
        console.log('✅ Redis reconnected');
        redisAvailable = true;
      }
    });
    
    await redis.connect();
    await redis.ping();
    
    redisAvailable = true;
    console.log('✅ Redis connected');
    return true;
  } catch (err) {
    redisAvailable = false;
    
    if (isProduction) {
      console.error('❌ CRITICAL: Redis is required in production!');
      console.error('   Please configure REDIS_URL environment variable.');
      console.error('   Error:', err.message);
      // In production, exit if Redis is not available
      process.exit(1);
    } else {
      console.warn('⚠️  Redis unavailable in development mode.');
      console.warn('   Rate limiting will be DISABLED until Redis is connected.');
      console.warn('   Start Redis: docker run -d -p 6379:6379 redis:7-alpine');
    }
    
    return false;
  }
}

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
 * @param {string|null} premiumToken - Premium token (unlimited if provided)
 * @returns {Promise<Object>} Rate limit status
 */
async function checkAIRateLimit(ip, premiumToken = null) {
  // Premium users have unlimited requests
  if (premiumToken) {
    return { 
      allowed: true, 
      remaining: 9999, 
      resetTime: Date.now() + AI_RATE_WINDOW * 1000 
    };
  }
  
  // If Redis is not available, allow request but warn
  if (!redisAvailable || !redis) {
    if (!isProduction) {
      // In dev mode without Redis, allow requests but log warning
      return { 
        allowed: true, 
        remaining: AI_RATE_LIMIT_FREE, 
        resetTime: Date.now() + AI_RATE_WINDOW * 1000,
        warning: 'Rate limiting disabled - Redis not available'
      };
    }
    // This should not happen in production (server exits if no Redis)
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: Date.now(),
      error: 'Rate limiting service unavailable'
    };
  }
  
  return checkRateLimitRedis(ip, AI_RATE_LIMIT_FREE);
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
    console.error('Rate limit refund error:', err.message);
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
      limit: AI_RATE_LIMIT_FREE, 
      remaining: AI_RATE_LIMIT_FREE, 
      resetTime: Date.now() + AI_RATE_WINDOW * 1000,
      redisAvailable: false
    };
  }
  
  try {
    const key = `ai:ratelimit:${ip}`;
    const count = parseInt(await redis.get(key) || '0', 10);
    const ttl = await redis.ttl(key);
    return { 
      limit: AI_RATE_LIMIT_FREE, 
      remaining: Math.max(0, AI_RATE_LIMIT_FREE - count), 
      resetTime: ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + AI_RATE_WINDOW * 1000,
      redisAvailable: true
    };
  } catch (err) {
    console.error('Get rate limit status error:', err.message);
    return { 
      limit: AI_RATE_LIMIT_FREE, 
      remaining: AI_RATE_LIMIT_FREE, 
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

module.exports = {
  initRedis,
  checkAIRateLimit,
  refundRateLimit,
  getRateLimitStatus,
  getClientIP,
  isRedisAvailable,
};
