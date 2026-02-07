/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

const crypto = require('crypto');
const { isProduction } = require('../config');

// Store CSRF tokens (in production, use Redis)
const csrfTokens = new Map();
const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Generate CSRF token
 * @returns {string} CSRF token
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get or create CSRF token for session
 * @param {string} sessionId - Session identifier (IP + User-Agent hash)
 * @returns {string} CSRF token
 */
function getOrCreateToken(sessionId) {
  // Check if token exists and is not expired
  if (csrfTokens.has(sessionId)) {
    const { token, expiresAt } = csrfTokens.get(sessionId);
    if (Date.now() < expiresAt) {
      return token;
    }
  }

  // Generate new token
  const token = generateCsrfToken();
  csrfTokens.set(sessionId, {
    token,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  });

  return token;
}

/**
 * Get session ID from request
 * @param {Object} req - Express request
 * @returns {string} Session ID
 */
function getSessionId(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.socket.remoteAddress ||
             'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create hash of IP + User-Agent as session ID
  return crypto
    .createHash('sha256')
    .update(ip + userAgent)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Middleware to generate and send CSRF token
 * Use this on GET requests to provide token to client
 */
function provideCsrfToken(req, res, next) {
  const sessionId = getSessionId(req);
  const token = getOrCreateToken(sessionId);

  // Add token to response header
  res.setHeader('X-CSRF-Token', token);

  // Also make it available on req for easy access
  req.csrfToken = token;

  next();
}

/**
 * Middleware to verify CSRF token
 * Use this on state-changing requests (POST, PUT, DELETE)
 */
function verifyCsrfToken(req, res, next) {
  // Skip verification for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip verification for webhooks (they have their own verification)
  if (req.path === '/webhook' || req.path.startsWith('/webhook')) {
    return next();
  }

  const sessionId = getSessionId(req);
  const clientToken = req.headers['x-csrf-token'] || req.body?.csrfToken;

  if (!clientToken) {
    if (!isProduction) {
      console.warn(`⚠️  Missing CSRF token for ${req.method} ${req.path}`);
    }
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token is required for this request',
    });
  }

  // Get stored token
  const stored = csrfTokens.get(sessionId);

  if (!stored) {
    if (!isProduction) {
      console.warn(`⚠️  No CSRF token found for session ${sessionId}`);
    }
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token not found or expired. Refresh the page.',
    });
  }

  // Check expiry
  if (Date.now() > stored.expiresAt) {
    csrfTokens.delete(sessionId);
    return res.status(403).json({
      error: 'CSRF token expired',
      message: 'CSRF token expired. Refresh the page.',
    });
  }

  // Verify token using constant-time comparison
  if (!crypto.timingSafeEqual(Buffer.from(clientToken), Buffer.from(stored.token))) {
    if (!isProduction) {
      console.warn(`⚠️  CSRF token mismatch for ${req.method} ${req.path}`);
    }
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token validation failed',
    });
  }

  // Token valid - continue
  next();
}

/**
 * Endpoint to get CSRF token
 * Client calls this to get a fresh token
 */
function getCsrfTokenEndpoint(req, res) {
  const sessionId = getSessionId(req);
  const token = getOrCreateToken(sessionId);

  res.json({
    csrfToken: token,
    expiresIn: TOKEN_EXPIRY_MS,
  });
}

/**
 * Cleanup expired tokens periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(sessionId);
    }
  }
}, 15 * 60 * 1000); // Cleanup every 15 minutes

/**
 * Middleware configuration options
 */
const csrfConfig = {
  // Paths that should skip CSRF verification
  skipPaths: [
    '/health',
    '/api/stripe-config',
    '/webhook',
  ],

  // Safe methods that don't need CSRF protection
  safeMethods: ['GET', 'HEAD', 'OPTIONS'],
};

/**
 * Smart CSRF middleware that auto-skips safe routes
 */
function smartCsrfProtection(req, res, next) {
  // Skip safe methods
  if (csrfConfig.safeMethods.includes(req.method)) {
    return next();
  }

  // Skip configured paths
  if (csrfConfig.skipPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  // Apply CSRF verification
  return verifyCsrfToken(req, res, next);
}

module.exports = {
  provideCsrfToken,
  verifyCsrfToken,
  getCsrfTokenEndpoint,
  smartCsrfProtection,
  csrfConfig,
};
