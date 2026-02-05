/**
 * Rate Limiting Middleware
 * Supports Redis (production) and in-memory (fallback) rate limiting
 */

const Redis = require('ioredis');
const { 
  isProduction, 
  REDIS_URL, 
  AI_RATE_LIMIT_FREE, 
  AI_RATE_WINDOW 
} = require('../config');

// Rate limit storage
let redis = null;
const aiRateLimits = new Map();

/**
 * Initialize Redis connection
 * @returns {Promise<boolean>} Success status
 */
async function initRedis() {
  try {
    redis = new Redis(REDIS_URL, { 
      maxRetriesPerRequest: 2,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });
    
    redis.on('error', (err) => {
      if (!isProduction) console.warn('Redis error:', err.message);
    });
    
    await redis.connect();
    await redis.ping();
    
    if (!isProduction) console.log('✅ Redis connected');
    return true;
  } catch (err) {
    const fallbackMsg = 'Using in-memory rate limiting (data lost on restart)';
    if (isProduction) {
      console.warn(`⚠️  Redis unavailable in production. ${fallbackMsg}`);
      console.warn('   Consider configuring REDIS_URL for persistent rate limiting.');
    } else {
      console.warn(`⚠️  Redis unavailable. ${fallbackMsg}`);
    }
    redis = null;
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
 * Check rate limit using in-memory storage
 * @param {string} ip - Client IP
 * @param {number} limit - Request limit
 * @returns {Object} Rate limit status
 */
function checkRateLimitMemory(ip, limit) {
  const now = Date.now();
  const record = aiRateLimits.get(ip);
  const resetTime = record?.resetTime || now + AI_RATE_WINDOW * 1000;
  
  if (!record || now > record.resetTime) {
    aiRateLimits.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Check AI rate limit (auto-selects storage backend)
 * @param {string} ip - Client IP
 * @param {string|null} premiumToken - Premium token (unlimited if provided)
 * @returns {Promise<Object>} Rate limit status
 */
async function checkAIRateLimit(ip, premiumToken = null) {
  const limit = premiumToken ? 9999 : AI_RATE_LIMIT_FREE;
  if (redis) return checkRateLimitRedis(ip, limit);
  return checkRateLimitMemory(ip, limit);
}

/**
 * Refund a rate limit count (on error)
 * @param {string} ip - Client IP
 */
async function refundRateLimit(ip) {
  if (redis) {
    const key = `ai:ratelimit:${ip}`;
    const count = await redis.get(key);
    if (count && parseInt(count, 10) > 0) await redis.decr(key);
  } else if (aiRateLimits.has(ip)) {
    const record = aiRateLimits.get(ip);
    if (record && record.count > 0) record.count--;
  }
}

/**
 * Get current rate limit status for an IP
 * @param {string} ip - Client IP
 * @returns {Promise<Object>} Current rate limit info
 */
async function getRateLimitStatus(ip) {
  if (redis) {
    try {
      const key = `ai:ratelimit:${ip}`;
      const count = parseInt(await redis.get(key) || '0', 10);
      const ttl = await redis.ttl(key);
      return { 
        limit: AI_RATE_LIMIT_FREE, 
        remaining: Math.max(0, AI_RATE_LIMIT_FREE - count), 
        resetTime: ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + AI_RATE_WINDOW * 1000,
      };
    } catch {
      // fall through to memory
    }
  }
  
  const now = Date.now();
  const record = aiRateLimits.get(ip);
  
  if (!record || now > record.resetTime) {
    return { 
      limit: AI_RATE_LIMIT_FREE, 
      remaining: AI_RATE_LIMIT_FREE, 
      resetTime: now + AI_RATE_WINDOW * 1000,
    };
  }
  
  return { 
    limit: AI_RATE_LIMIT_FREE, 
    remaining: Math.max(0, AI_RATE_LIMIT_FREE - record.count), 
    resetTime: record.resetTime,
  };
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

module.exports = {
  initRedis,
  checkAIRateLimit,
  refundRateLimit,
  getRateLimitStatus,
  getClientIP,
};
