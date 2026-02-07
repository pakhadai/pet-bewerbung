/**
 * Stripe Payment Controller
 * Handles all Stripe-related endpoints
 */

const Stripe = require('stripe');
const { 
  STRIPE_SECRET_KEY, 
  STRIPE_PUBLISHABLE_KEY, 
  STRIPE_WEBHOOK_SECRET,
  FRONTEND_URL,
  isProduction 
} = require('../config');
const { 
  createPremiumToken, 
  generateRestoreToken, 
  verifyRestoreToken,
  PREMIUM_DURATION_HOURS 
} = require('../middleware/premium');

// Initialize Stripe
const stripe = STRIPE_SECRET_KEY ? Stripe(STRIPE_SECRET_KEY) : null;

// Warn if not configured
if (!STRIPE_SECRET_KEY) {
  console.warn('⚠️  Warning: STRIPE_SECRET_KEY not set. Checkout requests will fail.');
} else if (!isProduction) {
  console.log('✅ STRIPE_SECRET_KEY is configured (length:', STRIPE_SECRET_KEY.length, 'chars)');
}

/**
 * Create Stripe Checkout Session
 */
async function createCheckoutSession(req, res) {
  const { amount, currency = 'chf', successUrl, cancelUrl, payment_method = 'card' } = req.body || {};

  if (!STRIPE_SECRET_KEY) {
    if (!isProduction) console.error('❌ STRIPE_SECRET_KEY not configured');
    return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  }

  // Validate amount type and value
  const numAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  if (typeof numAmount !== 'number' || isNaN(numAmount) || numAmount <= 0) {
    if (!isProduction) console.error('❌ Invalid amount:', amount, 'parsed:', numAmount);
    return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
  }

  const supported = { card: ['card'], twint: ['twint'] };
  const payment_method_types = supported[payment_method] || ['card'];
  const sessionCurrency = currency || 'chf';

  if (!isProduction) {
    console.log('Creating checkout session:', { payment_method, currency: sessionCurrency, amount });
  }

  try {
    const baseSuccessUrl = successUrl || 'http://localhost:3000';
    const successUrlSeparator = baseSuccessUrl.includes('?') ? '&' : '?';
    const finalSuccessUrl = `${baseSuccessUrl}${successUrlSeparator}session_id={CHECKOUT_SESSION_ID}&payment_success=true`;
    
    const baseCancelUrl = cancelUrl || 'http://localhost:3000';
    const cancelUrlSeparator = baseCancelUrl.includes('?') ? '&' : '?';
    const finalCancelUrl = `${baseCancelUrl}${cancelUrlSeparator}payment_canceled=true`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: sessionCurrency,
          product_data: { name: 'Support contribution — Pet CV' },
          unit_amount: numAmount, // Use validated number
        },
        quantity: 1,
      }],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    if (!isProduction) {
      console.error('Stripe checkout error:', err.message);
      console.error('Error details:', {
        type: err.type,
        code: err.code,
        statusCode: err.statusCode,
        raw: err.raw ? err.raw.message : null
      });
    }
    res.status(500).json({ 
      error: err.message || 'Server error',
      type: err.type,
      code: err.code,
      details: !isProduction ? err.raw?.message : undefined
    });
  }
}

/**
 * Create Payment Intent (for embedded form)
 */
async function createPaymentIntent(req, res) {
  const { amount, currency = 'chf' } = req.body || {};

  if (!STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  }

  // Validate amount type and value
  const numAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  if (typeof numAmount !== 'number' || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: numAmount, // Use validated number
      currency,
      payment_method_types: ['card', 'twint'],
    });

    res.json({ 
      clientSecret: intent.client_secret, 
      publishableKey: STRIPE_PUBLISHABLE_KEY || null, 
      paymentIntentId: intent.id 
    });
  } catch (err) {
    console.error('PaymentIntent error:', err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
}

/**
 * Get Stripe config (publishable key)
 */
function getStripeConfig(req, res) {
  res.json({ publishableKey: STRIPE_PUBLISHABLE_KEY || null });
}

/**
 * Get checkout session by ID
 */
async function getCheckoutSession(req, res) {
  const { id } = req.params;
  
  if (!STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    
    res.json({ 
      id: session.id,
      session: {
        id: session.id,
        status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
      }
    });
  } catch (err) {
    console.error('Error retrieving session:', err.message);
    res.status(404).json({ id, session: null, error: 'Session not found' });
  }
}

/**
 * Get payment status (auto-detects pi_ or cs_ prefix)
 */
async function getPaymentStatus(req, res) {
  const { id } = req.params;
  
  if (!STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  try {
    if (id.startsWith('pi_')) {
      const intent = await stripe.paymentIntents.retrieve(id);
      res.json({ 
        id, 
        type: 'payment_intent',
        status: intent.status,
        amount: intent.amount,
        currency: intent.currency
      });
    } else if (id.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(id);
      res.json({ 
        id, 
        type: 'checkout_session',
        status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
        amount: session.amount_total,
        currency: session.currency
      });
    } else {
      // Fallback: try both
      try {
        const intent = await stripe.paymentIntents.retrieve(id);
        res.json({ 
          id, 
          type: 'payment_intent',
          status: intent.status,
          amount: intent.amount,
          currency: intent.currency
        });
      } catch {
        try {
          const session = await stripe.checkout.sessions.retrieve(id);
          res.json({ 
            id, 
            type: 'checkout_session',
            status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
            amount: session.amount_total,
            currency: session.currency
          });
        } catch {
          throw new Error('Invalid payment ID format');
        }
      }
    }
  } catch (err) {
    console.error('Error retrieving payment status:', err.message);
    res.status(404).json({ id, status: null, error: err.message });
  }
}

/**
 * Handle Stripe webhook
 */
function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  if (!STRIPE_WEBHOOK_SECRET) {
    if (isProduction) {
      console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET not set in production!');
      return res.status(500).send('Webhook secret not configured');
    }
    console.warn('⚠️  ====== SECURITY WARNING ======');
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set!');
    console.warn('⚠️  Webhooks can be FORGED in dev mode.');
    console.warn('⚠️  Set STRIPE_WEBHOOK_SECRET for testing.');
    console.warn('⚠️  Use: stripe listen --forward-to localhost:4242/webhook');
    console.warn('⚠️  ===============================');
  }

  let event;

  try {
    if (STRIPE_WEBHOOK_SECRET) {
      // PRODUCTION: Always verify signature
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } else if (!isProduction) {
      // DEVELOPMENT: Parse but validate structure
      event = JSON.parse(req.body.toString());

      // Basic validation: Ensure it looks like a Stripe event
      if (!event.type || !event.data || !event.data.object) {
        console.error('❌ Invalid webhook structure - missing required fields');
        return res.status(400).send('Invalid webhook structure');
      }

      // Warn on sensitive events
      const sensitiveEvents = [
        'checkout.session.completed',
        'payment_intent.succeeded',
        'checkout.session.async_payment_succeeded'
      ];

      if (sensitiveEvents.includes(event.type)) {
        console.warn('⚠️  ⚠️  ⚠️  UNVERIFIED SENSITIVE WEBHOOK ⚠️  ⚠️  ⚠️');
        console.warn(`   Event: ${event.type}`);
        console.warn('   This could be FORGED! Set STRIPE_WEBHOOK_SECRET.');
      }

      console.warn('⚠️  Processing unverified webhook in development mode');
    } else {
      return res.status(400).send('Webhook signature verification required');
    }
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`✅ Checkout session completed. Amount: ${session.amount_total / 100} ${(session.currency || 'CHF').toUpperCase()}`);
      break;
    }
    case 'checkout.session.async_payment_succeeded':
      console.log('✅ Async payment succeeded');
      break;
    case 'checkout.session.async_payment_failed':
      console.log('❌ Async payment failed');
      break;
    case 'payment_intent.succeeded':
      console.log('✅ PaymentIntent succeeded');
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ PaymentIntent failed');
      break;
    default:
      if (!isProduction) {
        console.log(`Unhandled event type: ${event.type}`);
      }
  }

  res.json({ received: true });
}

/**
 * Activate premium after successful payment
 */
async function activatePremium(req, res) {
  const { sessionId, paymentIntentId, deviceId } = req.body || {};
  const paymentId = sessionId || paymentIntentId;
  
  if (!paymentId || !deviceId) {
    return res.status(400).json({ error: 'Payment ID and Device ID required' });
  }
  
  if (!STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }
  
  try {
    let paymentVerified = false;
    let verifiedId = paymentId;
    
    if (paymentId.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(paymentId);
      paymentVerified = session.payment_status === 'paid';
    } else if (paymentId.startsWith('pi_')) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      paymentVerified = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
    } else {
      // Fallback: try both
      try {
        const session = await stripe.checkout.sessions.retrieve(paymentId);
        paymentVerified = session.payment_status === 'paid';
      } catch {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
          paymentVerified = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
        } catch {
          paymentVerified = false;
        }
      }
    }
    
    if (!paymentVerified) {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    
    const token = await createPremiumToken(verifiedId, deviceId);
    const expiresIn = PREMIUM_DURATION_HOURS * 3600;
    
    if (!isProduction) {
      console.log(`✅ Premium activated for device ${deviceId.substring(0, 8)}... (${PREMIUM_DURATION_HOURS}h)`);
    }
    
    res.json({ 
      token, 
      expiresIn,
      expiresAt: Date.now() + expiresIn * 1000
    });
    
  } catch (err) {
    console.error('Premium activation error:', err.message);
    res.status(500).json({ error: 'Failed to activate premium' });
  }
}

/**
 * Verify restore token and return session info
 */
async function verifyRestore(req, res) {
  const { token } = req.params;

  const payload = await verifyRestoreToken(token);
  if (!payload) {
    return res.status(400).json({ valid: false, error: 'Invalid or expired token' });
  }
  
  if (!STRIPE_SECRET_KEY) {
    return res.status(400).json({ valid: false, error: 'Stripe not configured' });
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(payload.sid);
    
    if (session.payment_status === 'paid') {
      return res.json({ 
        valid: true, 
        sessionId: session.id,
        purchaseDate: new Date(session.created * 1000).toISOString()
      });
    }
    return res.json({ valid: false, error: 'Payment not completed' });
  } catch (err) {
    console.error('Restore verification error:', err.message);
    return res.status(404).json({ valid: false, error: 'Session not found' });
  }
}

/**
 * Generate restore link for email
 */
async function generateRestoreLink(req, res) {
  const { sessionId } = req.body || {};
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  if (!STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    
    const token = await generateRestoreToken(sessionId);
    const restoreUrl = `${FRONTEND_URL}?restore=${token}`;

    res.json({
      success: true,
      token,
      restoreUrl,
      expiresIn: '1 year'
    });
    
  } catch (err) {
    console.error('Generate restore link error:', err.message);
    res.status(500).json({ error: 'Failed to generate restore link' });
  }
}

module.exports = {
  createCheckoutSession,
  createPaymentIntent,
  getStripeConfig,
  getCheckoutSession,
  getPaymentStatus,
  handleWebhook,
  activatePremium,
  verifyRestore,
  generateRestoreLink,
};
