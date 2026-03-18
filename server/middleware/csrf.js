/**
 * CSRF Protection Middleware
 * Stateless Double Submit Cookie - no server-side token storage, no memory leak
 * Token in cookie must match token in header. Same-origin policy protects cookie.
 */

const crypto = require('crypto');
const { isProduction } = require('../config');
const { logger } = require('../utils/logger');

const CSRF_COOKIE = 'csrf_token';
const CSRF_MAX_AGE = 2 * 60 * 60; // 2 hours in seconds

/**
 * Generate CSRF token
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Middleware to provide CSRF token (Double Submit Cookie)
 * Sets cookie + header with same token. Client reads cookie and sends in header.
 */
function provideCsrfToken(req, res, next) {
  let token = req.cookies?.[CSRF_COOKIE];
  if (!token || token.length < 32) {
    token = generateCsrfToken();
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: true, // Client gets token from JSON/header only - XSS cannot read cookie
      secure: isProduction,
      sameSite: 'lax',
      maxAge: CSRF_MAX_AGE * 1000,
      path: '/',
    });
  }
  res.setHeader('X-CSRF-Token', token);
  req.csrfToken = token;
  next();
}

/**
 * Verify CSRF token - compare cookie with header (timing-safe)
 * SECURITY: Validate types before Buffer.from to prevent TypeError -> process.exit(1)
 */
function verifyCsrfToken(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  if (req.path === '/webhook' || req.path.startsWith('/webhook')) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'] || req.body?.csrfToken;

  if (!cookieToken || !headerToken) {
    if (!isProduction) {
      logger.warn(`Missing CSRF token for ${req.method} ${req.path}`);
    }
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token is required. Refresh the page.',
    });
  }

  if (typeof cookieToken !== 'string' || typeof headerToken !== 'string') {
    if (!isProduction) {
      logger.warn(`Invalid CSRF token type for ${req.method} ${req.path}`);
    }
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF validation failed. Refresh the page.',
    });
  }

  try {
    const cookieBuf = Buffer.from(cookieToken);
    const headerBuf = Buffer.from(headerToken);
    if (cookieBuf.length !== headerBuf.length || !crypto.timingSafeEqual(cookieBuf, headerBuf)) {
      if (!isProduction) {
        logger.warn(`CSRF token mismatch for ${req.method} ${req.path}`);
      }
      return res.status(403).json({
        error: 'Invalid CSRF token',
        message: 'CSRF validation failed. Refresh the page.',
      });
    }
  } catch (err) {
    logger.error('CSRF verification error:', err.message);
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF validation failed. Refresh the page.',
    });
  }

  next();
}

/**
 * Endpoint to get CSRF token (for SPA that fetches token via API)
 */
function getCsrfTokenEndpoint(req, res) {
  let token = req.cookies?.[CSRF_COOKIE];
  if (!token || token.length < 32) {
    token = generateCsrfToken();
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: CSRF_MAX_AGE * 1000,
      path: '/',
    });
  }
  res.json({
    csrfToken: token,
    expiresIn: CSRF_MAX_AGE * 1000,
  });
}

function stopCleanup() {
  // No cleanup - stateless
}

const csrfConfig = {
  skipPaths: ['/health', '/api/stripe-config', '/webhook'],
  safeMethods: ['GET', 'HEAD', 'OPTIONS'],
};

function smartCsrfProtection(req, res, next) {
  if (csrfConfig.safeMethods.includes(req.method)) return next();
  if (csrfConfig.skipPaths.some((p) => req.path.startsWith(p))) return next();
  return verifyCsrfToken(req, res, next);
}

module.exports = {
  provideCsrfToken,
  verifyCsrfToken,
  getCsrfTokenEndpoint,
  smartCsrfProtection,
  csrfConfig,
  stopCleanup,
};
