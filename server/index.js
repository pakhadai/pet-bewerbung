require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4242;
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) console.warn('Warning: STRIPE_SECRET_KEY not set. Checkout requests will fail.');
const stripe = Stripe(stripeKey || '');

// In-memory map to track payment statuses (paymentIntentId -> status)
const paymentStatus = {};
// In-memory map to track checkout sessions (sessionId -> session data)
const checkoutSessions = {};

app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'pet-bewerbung-server' });
});

app.post('/create-checkout-session', async (req, res) => {
  const { amount, currency = 'chf', successUrl, cancelUrl, payment_method = 'card' } = req.body || {};
  if (!stripeKey) return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  // Map requested payment method to Stripe Checkout supported payment_method_types
  // All payments use CHF (Swiss Francs) as default currency
  const supported = {
    card: ['card'],
    twint: ['twint'],
  };

  const payment_method_types = supported[payment_method] || ['card'];
  
  // All payments use CHF currency (Swiss service)
  const sessionCurrency = currency || 'chf';

  console.log('Creating checkout session:', {
    payment_method,
    payment_method_types,
    currency: sessionCurrency,
    amount
  });

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

    // Store session for webhook verification
    checkoutSessions[session.id] = {
      id: session.id,
      amount: amount,
      currency: sessionCurrency,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    console.error('Error details:', {
      message: err.message,
      type: err.type,
      code: err.code,
      payment_method: payment_method,
      currency: sessionCurrency,
      amount: amount
    });
    res.status(500).json({ 
      error: err.message || 'Server error',
      type: err.type,
      code: err.code
    });
  }
});

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

    // store initial status
    paymentStatus[intent.id] = intent.status;

    res.json({ clientSecret: intent.client_secret, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null, paymentIntentId: intent.id });
  } catch (err) {
    console.error('PaymentIntent error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.get('/stripe-config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null });
});

app.get('/payment-status/:id', (req, res) => {
  const id = req.params.id;
  const status = paymentStatus[id] || null;
  res.json({ id, status });
});

// Get checkout session status
app.get('/checkout-session/:id', (req, res) => {
  const id = req.params.id;
  const session = checkoutSessions[id] || null;
  res.json({ id, session });
});

// Webhook endpoint to receive Stripe events and update in-memory status
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // If no webhook secret configured, parse without verification (not recommended for prod)
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      if (checkoutSessions[session.id]) {
        checkoutSessions[session.id].status = 'completed';
        checkoutSessions[session.id].completedAt = new Date().toISOString();
        checkoutSessions[session.id].customerEmail = session.customer_email;
        checkoutSessions[session.id].amountTotal = session.amount_total;
      }
      console.log(`✅ Checkout session ${session.id} completed. Amount: ${session.amount_total / 100} ${session.currency.toUpperCase()}`);
      break;
    case 'checkout.session.async_payment_succeeded':
      const asyncSession = event.data.object;
      if (checkoutSessions[asyncSession.id]) {
        checkoutSessions[asyncSession.id].status = 'completed';
      }
      console.log(`✅ Async payment succeeded for session ${asyncSession.id}`);
      break;
    case 'checkout.session.async_payment_failed':
      const failedSession = event.data.object;
      if (checkoutSessions[failedSession.id]) {
        checkoutSessions[failedSession.id].status = 'failed';
      }
      console.log(`❌ Async payment failed for session ${failedSession.id}`);
      break;
    case 'payment_intent.succeeded':
      paymentStatus[event.data.object.id] = 'succeeded';
      console.log(`PaymentIntent ${event.data.object.id} succeeded.`);
      break;
    case 'payment_intent.payment_failed':
      paymentStatus[event.data.object.id] = 'failed';
      console.log(`PaymentIntent ${event.data.object.id} failed.`);
      break;
    case 'payment_intent.processing':
      paymentStatus[event.data.object.id] = 'processing';
      break;
    default:
      // unexpected events
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(port, () => console.log(`Stripe helper server listening on http://localhost:${port}`));
