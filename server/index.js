/**
 * Pet-Bewerbung Server
 * Main entry point - uses modular controllers and middleware
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import configuration
const {
  PORT,
  isProduction,
  ALLOWED_ORIGINS
} = require('./config');

// Import logger
const { logger } = require('./utils/logger');

// Import middleware
const { initRedis, getRedisClient } = require('./middleware/rateLimit');
const {
  provideCsrfToken,
  smartCsrfProtection,
  getCsrfTokenEndpoint
} = require('./middleware/csrf');
const { csrfTokenRateLimit } = require('./middleware/csrfRateLimit');
const { trackRequestSize } = require('./middleware/requestLimits');

// Import controllers
const ai = require('./controllers/ai');

// Initialize Express app
const app = express();

// ============================================
// Trust proxy: only local/proxy IPs (prevents X-Forwarded-For spoofing)
// Use TRUST_PROXY=1 env to allow any proxy (e.g. Cloudflare) - less secure
// ============================================
app.set('trust proxy', process.env.TRUST_PROXY === '1' ? 1 : ['loopback', 'linklocal', 'uniquelocal']);

// ============================================
// Cookie parsing (required for CSRF session isolation)
// ============================================
app.use(cookieParser());

// ============================================
// CORS Configuration
// ============================================
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin only in development (Postman, curl, etc.)
    // SECURITY: In production, reject requests without Origin to prevent bypass attacks
    if (!origin) {
      if (!isProduction) {
        logger.debug('Request without Origin header (likely non-browser client)');
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Origin required'));
    }

    // Check if origin is in allowed list
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Block unrecognized origins
    logger.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));

// ============================================
// CSRF Protection Middleware
// ============================================
// Provide CSRF token on all GET requests
app.use(provideCsrfToken);

// Protect state-changing requests (POST, PUT, DELETE)
app.use(smartCsrfProtection);

// ============================================
// Request size tracking (bandwidth DoS protection)
// MUST run BEFORE body parsing so req.on('data') receives chunks in real-time
// ============================================
app.use(trackRequestSize);

// ============================================
// Body Parsing Middleware
// SECURITY: Explicit size limits prevent DoS attacks via large payloads
// ============================================
app.use(express.json({ limit: '50kb' }));

// ============================================
// Health Check
// ============================================
app.get('/', (req, res) => {
  const { isRedisAvailable } = require('./middleware/rateLimit');
  const health = {
    status: 'ok',
    service: 'pet-bewerbung-server',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    checks: {
      redis: isRedisAvailable() ? 'ok' : 'unavailable',
      ai: !!require('./config').GEMINI_API_KEY ? 'configured' : 'not_configured',
    }
  };

  if (health.checks.redis === 'unavailable' && isProduction) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// ============================================
// CSRF Token Endpoint (rate limited to prevent Redis DoS)
// ============================================
app.get('/csrf-token', csrfTokenRateLimit, getCsrfTokenEndpoint);

// ============================================
// AI Routes
// ============================================
app.post('/generate-pet-description', ai.generatePetDescription);
app.get('/ai-rate-limit', ai.getAIRateLimitStatus);

// ============================================
// Error Handling Middleware
// ============================================
app.use((err, req, res, next) => {
  if (err.message === 'CORS policy: Origin not allowed' || err.message === 'CORS policy: Origin required') {
    return res.status(403).json({ error: 'CORS not allowed' });
  }
  logger.error('Server error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Global Unhandled Rejection Handler
// ============================================
process.on('unhandledRejection', (reason, promise) => {
  logger.error('FATAL: Unhandled Rejection', {
    promise: String(promise),
    reason: String(reason),
    stack: reason?.stack || 'No stack trace available'
  });
  // Exit process to allow restart by process manager
  process.exit(1);
});

// ============================================
// Graceful Shutdown Handler
// Uses stoppable to close keep-alive connections, not just stop accepting new ones
// ============================================
const stoppable = require('stoppable');
let server;
const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => {
      server.stop(() => {
        logger.info('HTTP server closed (all connections terminated)');
        resolve();
      });
    });
  }

  // Stop cleanup intervals
  try {
    const { stopCleanup: stopRequestLimitsCleanup } = require('./middleware/requestLimits');
    stopRequestLimitsCleanup();
    logger.info('Cleanup intervals stopped');
  } catch (err) {
    logger.error('Error stopping cleanup intervals', { message: err.message });
  }

  // Close Redis connection (also stops rate limit cleanup interval)
  try {
    const { closeRedis } = require('./middleware/rateLimit');
    await closeRedis();
    logger.info('Redis connection closed');
  } catch (err) {
    logger.error('Error closing Redis', { message: err.message });
  }

  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ============================================
// Server Startup
// ============================================
initRedis()
  .then(() => {
    const httpServer = app.listen(PORT, () => {
      logger.info(`Pet-Bewerbung server running on http://localhost:${PORT}`);
      logger.info(`Environment: ${isProduction ? 'PRODUCTION' : 'development'}`);
      if (!isProduction) {
        logger.debug(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
      }
    });
    server = stoppable(httpServer);
  })
  .catch((err) => {
    logger.error('FATAL: Failed to initialize server', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  });
