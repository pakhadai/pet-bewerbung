/**
 * Premium JWT Session Management
 * Handles premium token creation, verification, and middleware
 */

const { SignJWT, jwtVerify } = require('jose');
const { JWT_SECRET, PREMIUM_DURATION_HOURS, isProduction } = require('../config');

/**
 * Create a premium JWT token with device binding
 * @param {string} sessionId - Stripe session/payment ID
 * @param {string} deviceId - Client device UUID
 * @returns {Promise<string>} JWT token
 */
async function createPremiumToken(sessionId, deviceId) {
  return new SignJWT({ 
    sid: sessionId, 
    did: deviceId,
    type: 'premium'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PREMIUM_DURATION_HOURS}h`)
    .sign(JWT_SECRET);
}

/**
 * Verify premium JWT token and check device binding
 * @param {string} token - JWT token
 * @param {string} deviceId - Client device UUID
 * @returns {Promise<Object>} Verification result
 */
async function verifyPremiumToken(token, deviceId) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check device binding
    if (payload.did !== deviceId) {
      return { valid: false, error: 'device_mismatch' };
    }
    
    // Calculate time remaining
    const exp = payload.exp * 1000;
    const timeRemaining = Math.max(0, exp - Date.now());
    
    return { valid: true, payload, timeRemaining };
  } catch (err) {
    if (err.code === 'ERR_JWT_EXPIRED') {
      return { valid: false, error: 'expired' };
    }
    return { valid: false, error: 'invalid' };
  }
}

/**
 * Express middleware to require premium token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
async function requirePremium(req, res, next) {
  const token = req.headers['x-premium-token'];
  const deviceId = req.headers['x-device-id'];
  
  if (!token || !deviceId) {
    return res.status(401).json({ error: 'Premium token required', code: 'NO_TOKEN' });
  }
  
  const result = await verifyPremiumToken(token, deviceId);
  
  if (!result.valid) {
    return res.status(401).json({ 
      error: result.error === 'expired' ? 'Premium session expired' : 
             result.error === 'device_mismatch' ? 'Token bound to different device' : 
             'Invalid premium token',
      code: result.error?.toUpperCase() || 'INVALID'
    });
  }
  
  req.premium = result.payload;
  req.premiumTimeRemaining = result.timeRemaining;
  next();
}

/**
 * Generate a restore token for email after purchase
 * @param {string} sessionId - Stripe session ID
 * @returns {string} Base64url encoded token
 */
function generateRestoreToken(sessionId) {
  const payload = JSON.stringify({ 
    sid: sessionId, 
    ts: Date.now(),
    exp: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year
  });
  return Buffer.from(payload).toString('base64url');
}

/**
 * Verify a restore token
 * @param {string} token - Base64url encoded token
 * @returns {Object|null} Payload or null if invalid
 */
function verifyRestoreToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString());
    if (!payload.sid || !payload.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  createPremiumToken,
  verifyPremiumToken,
  requirePremium,
  generateRestoreToken,
  verifyRestoreToken,
  PREMIUM_DURATION_HOURS,
};
