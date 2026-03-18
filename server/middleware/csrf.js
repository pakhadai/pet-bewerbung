/**
 * CSRF Protection Middleware
 * Stateless Double Submit Cookie - no server-side token storage, no memory leak
 * Token in cookie must match token in header. Same-origin policy protects cookie.
 */

const crypto = require('crypto');
const { isProduction, COOKIE_SECRET } = require('../config');
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
 * Get CSRF token from request (signed cookie takes precedence when available)
 */
function getCsrfTokenFromRequest(req) {
  if (COOKIE_SECRET && req.signedCookies?.[CSRF_COOKIE]) {
    return req.signedCookies[CSRF_COOKIE];
  }
  return req.cookies?.[CSRF_COOKIE];
}

/**
 * Middleware to provide CSRF token (Double Submit Cookie with HMAC-signed cookie)
 * Signed cookie prevents token forgery: attacker cannot set victim's cookie to match their token.
 */
function provideCsrfToken(req, res, next) {
  let token = getCsrfTokenFromRequest(req);
  if (!token || token.length < 32) {
    token = generateCsrfToken();
    const cookieOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: CSRF_MAX_AGE * 1000,
      path: '/',
    };
    if (COOKIE_SECRET) {
      res.cookie(CSRF_COOKIE, token, { ...cookieOpts, signed: true });
    } else {
      res.cookie(CSRF_COOKIE, token, cookieOpts);
    }
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

  const cookieToken = getCsrfTokenFromRequest(req);
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
    // timingSafeEqual throws if lengths differ - check first
    if (cookieBuf.length !== headerBuf.length) {
      return res.status(403).json({
        error: 'Invalid CSRF token',
        message: 'CSRF validation failed. Refresh the page.',
      });
    }
    if (!crypto.timingSafeEqual(cookieBuf, headerBuf)) {
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
  let token = getCsrfTokenFromRequest(req);
  if (!token || token.length < 32) {
    token = generateCsrfToken();
    const cookieOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: CSRF_MAX_AGE * 1000,
      path: '/',
    };
    if (COOKIE_SECRET) {
      res.cookie(CSRF_COOKIE, token, { ...cookieOpts, signed: true });
    } else {
      res.cookie(CSRF_COOKIE, token, cookieOpts);
    }
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
