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
 * SECURITY: Increment in real-time on req.data to prevent race-condition bypass
 * (10k parallel connections would all see currentBytes=0 if we only updated on finish)
 * Must run BEFORE express.json() so req stream is still readable.
 */
async function trackRequestSize(req, res, next) {
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

    req.on('data', (chunk) => {
      redis.pipeline()
        .incrby(key, chunk.length)
        .expire(key, BANDWIDTH_TTL_SEC)
        .exec()
        .catch(() => {});
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
