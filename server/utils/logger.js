/**
 * Centralized Logging Service
 * Structured logging with different levels and formats
 */

const { isProduction } = require('../config');

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Current log level (configurable via env)
const CURRENT_LEVEL = process.env.LOG_LEVEL
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()]
  : isProduction
  ? LOG_LEVELS.INFO
  : LOG_LEVELS.DEBUG;

/**
 * Format timestamp
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
function formatLog(level, message, meta = {}) {
  if (isProduction) {
    // JSON format for production (easy to parse by log aggregators)
    return JSON.stringify({
      timestamp: timestamp(),
      level,
      message,
      ...meta,
    });
  } else {
    // Human-readable format for development
    const metaStr = Object.keys(meta).length > 0 ? `\n  ${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp()}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }
}

/**
 * Logger class
 */
class Logger {
  constructor(context = 'app') {
    this.context = context;
  }

  /**
   * Log error message
   */
  error(message, meta = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(formatLog('error', message, { ...meta, context: this.context }));
    }
  }

  /**
   * Log warning message
   */
  warn(message, meta = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(formatLog('warn', message, { ...meta, context: this.context }));
    }
  }

  /**
   * Log info message
   */
  info(message, meta = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      console.log(formatLog('info', message, { ...meta, context: this.context }));
    }
  }

  /**
   * Log debug message
   */
  debug(message, meta = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      console.log(formatLog('debug', message, { ...meta, context: this.context }));
    }
  }

  /**
   * Log HTTP request
   */
  request(req, meta = {}) {
    this.info('HTTP Request', {
      method: req.method,
      path: req.path,
      ip: req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      ...meta,
    });
  }

  /**
   * Log security event
   */
  security(message, meta = {}) {
    this.warn(`SECURITY: ${message}`, {
      ...meta,
      security: true,
    });
  }

  /**
   * Create child logger with additional context
   */
  child(context) {
    return new Logger(`${this.context}:${context}`);
  }
}

/**
 * Default logger instance
 */
const logger = new Logger('app');

/**
 * Create logger for specific module
 */
function createLogger(context) {
  return new Logger(context);
}

/**
 * Express middleware for request logging
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request
  logger.request(req);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[level]('HTTP Response', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}

/**
 * Error logging middleware
 */
function errorLogger(err, req, res, next) {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress,
  });

  next(err);
}

/**
 * Log startup info
 */
function logStartup(config) {
  logger.info('Server starting', {
    environment: isProduction ? 'production' : 'development',
    port: config.port,
    nodeVersion: process.version,
  });
}

/**
 * Security event logger
 */
const securityLogger = {
  loginAttempt: (ip, success) => {
    logger.security('Login attempt', { ip, success });
  },

  rateLimitExceeded: (ip, endpoint) => {
    logger.security('Rate limit exceeded', { ip, endpoint });
  },

  csrfViolation: (ip, endpoint) => {
    logger.security('CSRF violation', { ip, endpoint });
  },

  suspiciousActivity: (ip, reason) => {
    logger.security('Suspicious activity detected', { ip, reason });
  },

  tokenValidationFailed: (ip, reason) => {
    logger.security('Token validation failed', { ip, reason });
  },
};

module.exports = {
  logger,
  createLogger,
  requestLogger,
  errorLogger,
  logStartup,
  securityLogger,
  LOG_LEVELS,
};
