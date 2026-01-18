require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4242;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const isProduction = process.env.NODE_ENV === 'production';

if (!stripeKey) console.warn('Warning: STRIPE_SECRET_KEY not set. Checkout requests will fail.');
const stripe = Stripe(stripeKey || '');

// ============================================
// SECURITY: CORS Configuration
// ============================================
const allowedOrigins = [
  // Production domains
  'https://pet.ohmyrevit.pp.ua',
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
  // Development domains
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, mobile apps)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));

// JSON parser for all routes except webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// ============================================
// Health check endpoint
// ============================================
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'pet-bewerbung-server', environment: isProduction ? 'production' : 'development' });
});

// ============================================
// Stripe Checkout Session
// ============================================
app.post('/create-checkout-session', async (req, res) => {
  const { amount, currency = 'chf', successUrl, cancelUrl, payment_method = 'card' } = req.body || {};
  if (!stripeKey) return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  // Map requested payment method to Stripe Checkout supported payment_method_types
  const supported = {
    card: ['card'],
    twint: ['twint'],
  };

  const payment_method_types = supported[payment_method] || ['card'];
  const sessionCurrency = currency || 'chf';

  // Log without sensitive data
  if (!isProduction) {
    console.log('Creating checkout session:', { payment_method, currency: sessionCurrency, amount });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: sessionCurrency,
            product_data: { name: 'Donation — Pet CV' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${successUrl || 'http://localhost:3000'}?session_id={CHECKOUT_SESSION_ID}&payment_success=true`,
      cancel_url: `${cancelUrl || 'http://localhost:3000'}?payment_canceled=true`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ 
      error: err.message || 'Server error',
      type: err.type,
      code: err.code
    });
  }
});

// ============================================
// Payment Intent (for embedded form)
// ============================================
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'chf' } = req.body || {};
  if (!stripeKey) return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ 
      clientSecret: intent.client_secret, 
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null, 
      paymentIntentId: intent.id 
    });
  } catch (err) {
    console.error('PaymentIntent error:', err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ============================================
// Stripe Config (publishable key)
// ============================================
app.get('/stripe-config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null });
});

// ============================================
// Get checkout session status from Stripe API
// (Not from in-memory cache - survives server restarts)
// ============================================
app.get('/checkout-session/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!stripeKey) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  try {
    // Retrieve session directly from Stripe API
    const session = await stripe.checkout.sessions.retrieve(id);
    
    res.json({ 
      id: session.id,
      session: {
        id: session.id,
        status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        // Do not expose customer email in response
      }
    });
  } catch (err) {
    console.error('Error retrieving session:', err.message);
    res.status(404).json({ id, session: null, error: 'Session not found' });
  }
});

// ============================================
// Get payment intent status from Stripe API
// ============================================
app.get('/payment-status/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!stripeKey) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(id);
    res.json({ id, status: intent.status });
  } catch (err) {
    console.error('Error retrieving payment intent:', err.message);
    res.json({ id, status: null });
  }
});

// ============================================
// Webhook endpoint - SECURE
// ============================================
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  // SECURITY: In production, webhook secret is REQUIRED
  if (!webhookSecret) {
    if (isProduction) {
      console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET not set in production!');
      return res.status(500).send('Webhook secret not configured');
    } else {
      console.warn('⚠️  Development mode: Webhook secret not set. Skipping signature verification.');
    }
  }

  let event;

  try {
    if (webhookSecret) {
      // SECURITY: Always verify webhook signature when secret is available
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else if (!isProduction) {
      // Only allow unverified webhooks in development
      event = JSON.parse(req.body.toString());
      console.warn('⚠️  Processing unverified webhook in development mode');
    } else {
      // SECURITY: Never process unverified webhooks in production
      return res.status(400).send('Webhook signature verification required');
    }
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event (no PII logging)
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Log without PII (no email)
      console.log(`✅ Checkout session completed. Amount: ${session.amount_total / 100} ${(session.currency || 'CHF').toUpperCase()}`);
      break;
    case 'checkout.session.async_payment_succeeded':
      console.log(`✅ Async payment succeeded`);
      break;
    case 'checkout.session.async_payment_failed':
      console.log(`❌ Async payment failed`);
      break;
    case 'payment_intent.succeeded':
      console.log(`✅ PaymentIntent succeeded`);
      break;
    case 'payment_intent.payment_failed':
      console.log(`❌ PaymentIntent failed`);
      break;
    default:
      if (!isProduction) {
        console.log(`Unhandled event type: ${event.type}`);
      }
  }

  res.json({ received: true });
});

// ============================================
// Error handling middleware
// ============================================
app.use((err, req, res, next) => {
  if (err.message === 'CORS policy: Origin not allowed') {
    return res.status(403).json({ error: 'CORS not allowed' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 Pet-Bewerbung server running on http://localhost:${port}`);
  console.log(`📍 Environment: ${isProduction ? 'PRODUCTION' : 'development'}`);
  if (!isProduction) {
    console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
  }
});
