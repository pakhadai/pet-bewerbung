/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 * Uses Redis for token storage in production, falls back to in-memory for development
 */

const crypto = require('crypto');
const { isProduction } = require('../config');
const { logger } = require('../utils/logger');

// Token storage backend (Redis or in-memory)
let redis = null;
let useRedisStorage = false;

// In-memory fallback store
const csrfTokens = new Map();
const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours
const TOKEN_EXPIRY_SECONDS = 2 * 60 * 60; // 2 hours in seconds (for Redis TTL)

/**
 * Initialize Redis for CSRF storage (called from server startup)
 * @param {Object} redisClient - Existing Redis client from rateLimit module
 */
function initCsrfRedis(redisClient) {
  if (redisClient) {
    redis = redisClient;
    useRedisStorage = true;
    logger.info('CSRF: Using Redis for token storage');
  } else {
    logger.warn('CSRF: Using in-memory token storage (not suitable for multi-server)');
  }
}

/**
 * Generate CSRF token
 * @returns {string} CSRF token
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get or create CSRF token for session (Redis)
 */
async function getOrCreateTokenRedis(sessionId) {
  const key = `csrf:${sessionId}`;

  try {
    const existing = await redis.get(key);
    if (existing) return existing;

    const token = generateCsrfToken();
    await redis.setex(key, TOKEN_EXPIRY_SECONDS, token);
    return token;
  } catch (err) {
    logger.error('CSRF Redis error, falling back to in-memory:', err.message);
    return getOrCreateTokenMemory(sessionId);
  }
}

/**
 * Get or create CSRF token for session (in-memory)
 */
function getOrCreateTokenMemory(sessionId) {
  if (csrfTokens.has(sessionId)) {
    const { token, expiresAt } = csrfTokens.get(sessionId);
    if (Date.now() < expiresAt) {
      return token;
    }
  }

  const token = generateCsrfToken();
  csrfTokens.set(sessionId, {
    token,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  });

  return token;
}

/**
 * Get or create CSRF token (auto-selects storage backend)
 */
async function getOrCreateToken(sessionId) {
  if (useRedisStorage && redis) {
    return getOrCreateTokenRedis(sessionId);
  }
  return getOrCreateTokenMemory(sessionId);
}

/**
 * Verify token from Redis
 */
async function verifyTokenRedis(sessionId, clientToken) {
  const key = `csrf:${sessionId}`;

  try {
    const storedToken = await redis.get(key);
    if (!storedToken) return { valid: false, reason: 'not_found' };

    const clientBuffer = Buffer.from(clientToken);
    const storedBuffer = Buffer.from(storedToken);

    if (clientBuffer.length !== storedBuffer.length) {
      return { valid: false, reason: 'length_mismatch' };
    }

    if (!crypto.timingSafeEqual(clientBuffer, storedBuffer)) {
      return { valid: false, reason: 'mismatch' };
    }

    return { valid: true };
  } catch (err) {
    logger.error('CSRF Redis verification error, falling back to in-memory:', err.message);
    return verifyTokenMemory(sessionId, clientToken);
  }
}

/**
 * Verify token from in-memory store
 */
function verifyTokenMemory(sessionId, clientToken) {
  const stored = csrfTokens.get(sessionId);
  if (!stored) return { valid: false, reason: 'not_found' };

  if (Date.now() > stored.expiresAt) {
    csrfTokens.delete(sessionId);
    return { valid: false, reason: 'expired' };
  }

  const clientBuffer = Buffer.from(clientToken);
  const storedBuffer = Buffer.from(stored.token);

  if (clientBuffer.length !== storedBuffer.length) {
    return { valid: false, reason: 'length_mismatch' };
  }

  if (!crypto.timingSafeEqual(clientBuffer, storedBuffer)) {
    return { valid: false, reason: 'mismatch' };
  }

  return { valid: true };
}

/**
 * Verify CSRF token (auto-selects storage backend)
 */
async function verifyToken(sessionId, clientToken) {
  if (useRedisStorage && redis) {
    return verifyTokenRedis(sessionId, clientToken);
  }
  return verifyTokenMemory(sessionId, clientToken);
}

const CSRF_SESSION_COOKIE = 'csrf_session';
const CSRF_SESSION_MAX_AGE = 2 * 60 * 60; // 2 hours in seconds

/**
 * Get or create session ID from request
 * Uses cookie-based session for proper user isolation (IP+UA is not unique per user)
 * @param {Object} req - Express request
 * @param {Object} res - Express response (for setting cookie if needed)
 * @returns {string} Session ID
 */
function getSessionId(req, res) {
  let sessionId = req.cookies?.[CSRF_SESSION_COOKIE];
  if (!sessionId || sessionId.length < 16) {
    sessionId = crypto.randomBytes(24).toString('hex');
    if (res && res.cookie) {
      res.cookie(CSRF_SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: CSRF_SESSION_MAX_AGE * 1000,
        path: '/',
      });
    }
  }
  return crypto.createHash('sha256').update(sessionId).digest('hex').substring(0, 32);
}

/**
 * Middleware to generate and send CSRF token
 */
async function provideCsrfToken(req, res, next) {
  try {
    const sessionId = getSessionId(req, res);
    const token = await getOrCreateToken(sessionId);
    res.setHeader('X-CSRF-Token', token);
    req.csrfToken = token;
  } catch (err) {
    logger.error('CSRF token generation error:', err.message);
  }
  next();
}

/**
 * Middleware to verify CSRF token
 */
async function verifyCsrfToken(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  if (req.path === '/webhook' || req.path.startsWith('/webhook')) {
    return next();
  }

  const sessionId = getSessionId(req, res);
  const clientToken = req.headers['x-csrf-token'] || req.body?.csrfToken;

  if (!clientToken) {
    if (!isProduction) {
      logger.warn(`Missing CSRF token for ${req.method} ${req.path}`);
    }
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token is required for this request',
    });
  }

  const result = await verifyToken(sessionId, clientToken);

  if (!result.valid) {
    if (!isProduction) {
      logger.warn(`CSRF validation failed (${result.reason}) for ${req.method} ${req.path}`);
    }
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: result.reason === 'expired'
        ? 'CSRF token expired. Refresh the page.'
        : 'CSRF token validation failed',
    });
  }

  next();
}

/**
 * Endpoint to get CSRF token
 */
async function getCsrfTokenEndpoint(req, res) {
  const sessionId = getSessionId(req, res);
  const token = await getOrCreateToken(sessionId);

  res.json({
    csrfToken: token,
    expiresIn: TOKEN_EXPIRY_MS,
  });
}

/**
 * Cleanup expired in-memory tokens periodically
 */
let cleanupInterval = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    for (const [sessionId, data] of csrfTokens.entries()) {
      if (now > data.expiresAt) {
        csrfTokens.delete(sessionId);
        cleaned++;
      }
    }
    if (cleaned > 0 && !isProduction) {
      logger.debug(`CSRF: Cleaned ${cleaned} expired in-memory tokens`);
    }
  }, 15 * 60 * 1000);
}

function stopCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

// Auto-start cleanup for in-memory storage
startCleanup();

/**
 * Middleware configuration options
 */
const csrfConfig = {
  skipPaths: [
    '/health',
    '/api/stripe-config',
    '/webhook',
  ],
  safeMethods: ['GET', 'HEAD', 'OPTIONS'],
};

/**
 * Smart CSRF middleware that auto-skips safe routes
 */
function smartCsrfProtection(req, res, next) {
  if (csrfConfig.safeMethods.includes(req.method)) {
    return next();
  }
  if (csrfConfig.skipPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }
  return verifyCsrfToken(req, res, next);
}

module.exports = {
  initCsrfRedis,
  provideCsrfToken,
  verifyCsrfToken,
  getCsrfTokenEndpoint,
  smartCsrfProtection,
  csrfConfig,
  stopCleanup,
};
