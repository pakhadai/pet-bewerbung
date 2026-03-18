/**
 * Request Size Limits Middleware
 * Prevents DoS attacks via large payloads.
 * SECURITY: Uses Redis with TTL - no in-memory Map that can exhaust memory.
 * Uses actual socket.bytesRead delta, not Content-Length.
 */

const { getClientIP, getRedisClient, isRedisAvailable } = require('./rateLimit');

// Size limits for different endpoints (in bytes)
const SIZE_LIMITS = {
  default: 1 * 1024 * 1024, // 1 MB
  '/generate-pet-description': 50 * 1024, // 50 KB (text only)
};

const MAX_BYTES_PER_HOUR = 100 * 1024 * 1024; // 100 MB per hour per IP
const BANDWIDTH_TTL_SEC = 3600; // 1 hour

/**
 * Rate limit by request size (prevent abuse)
 * Uses Redis INCRBY + EXPIRE - no memory exhaustion, no blocking cleanup
 */
async function trackRequestSize(req, res, next) {
  const initialBytes = req.socket.bytesRead || 0;
  const ip = getClientIP(req);
  const redis = getRedisClient();

  if (redis && isRedisAvailable()) {
    const key = `bandwidth:${ip}`;
    const currentBytes = parseInt(await redis.get(key) || '0', 10);

    if (currentBytes >= MAX_BYTES_PER_HOUR) {
      const ttl = await redis.ttl(key);
      return res.status(429).json({
        error: 'Bandwidth limit exceeded',
        message: `Maximum 100MB per hour exceeded. Try again later.`,
        resetTime: new Date(Date.now() + (ttl > 0 ? ttl * 1000 : BANDWIDTH_TTL_SEC * 1000)).toISOString(),
      });
    }

    res.on('finish', () => {
      const finalBytes = req.socket.bytesRead || 0;
      const actualBytes = Math.max(0, finalBytes - initialBytes);
      redis.incrby(key, actualBytes).then(() => redis.expire(key, BANDWIDTH_TTL_SEC)).catch(() => {});
    });
  }

  next();
}

function stopCleanup() {
  // No cleanup needed - Redis TTL handles expiry
}

module.exports = {
  trackRequestSize,
  stopCleanup,
  SIZE_LIMITS,
};
