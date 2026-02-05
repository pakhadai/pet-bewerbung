/**
 * Pet-Bewerbung Server
 * Main entry point - uses modular controllers and middleware
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import configuration
const { 
  PORT, 
  isProduction, 
  ALLOWED_ORIGINS 
} = require('./config');

// Import middleware
const { initRedis } = require('./middleware/rateLimit');

// Import controllers
const stripe = require('./controllers/stripe');
const ai = require('./controllers/ai');

// Initialize Express app
const app = express();

// ============================================
// CORS Configuration
// ============================================
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));

// ============================================
// Body Parsing Middleware
// JSON parser for all routes except webhook (webhook needs raw body)
// ============================================
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// ============================================
// Health Check
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'pet-bewerbung-server', 
    environment: isProduction ? 'production' : 'development' 
  });
});

// ============================================
// Stripe Routes
// ============================================
app.post('/create-checkout-session', stripe.createCheckoutSession);
app.post('/create-payment-intent', stripe.createPaymentIntent);
app.get('/stripe-config', stripe.getStripeConfig);
app.get('/checkout-session/:id', stripe.getCheckoutSession);
app.get('/payment-status/:id', stripe.getPaymentStatus);
app.post('/webhook', express.raw({ type: 'application/json' }), stripe.handleWebhook);

// Premium activation and restoration
app.post('/activate-premium', stripe.activatePremium);
app.get('/verify-restore/:token', stripe.verifyRestore);
app.post('/generate-restore-link', stripe.generateRestoreLink);

// ============================================
// AI Routes
// ============================================
app.post('/generate-pet-description', ai.generatePetDescription);
app.get('/ai-rate-limit', ai.getAIRateLimitStatus);
app.post('/improve-text', ai.improveText);

// ============================================
// Premium Verification Route
// ============================================
const { verifyPremiumToken } = require('./middleware/premium');

app.post('/verify-premium', async (req, res) => {
  const { token, deviceId } = req.body || {};
  
  if (!token || !deviceId) {
    return res.status(400).json({ valid: false, error: 'Token and Device ID required' });
  }
  
  const result = await verifyPremiumToken(token, deviceId);
  
  if (!isProduction && !result.valid) {
    console.log(`❌ Premium verification failed: ${result.error}`);
  }
  
  res.json(result);
});

// ============================================
// Error Handling Middleware
// ============================================
app.use((err, req, res, next) => {
  if (err.message === 'CORS policy: Origin not allowed') {
    return res.status(403).json({ error: 'CORS not allowed' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Server Startup
// ============================================
initRedis().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Pet-Bewerbung server running on http://localhost:${PORT}`);
    console.log(`📍 Environment: ${isProduction ? 'PRODUCTION' : 'development'}`);
    if (!isProduction) {
      console.log(`📋 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
    }
  });
});
