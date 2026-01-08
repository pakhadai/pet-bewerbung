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

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount, currency = 'eur', successUrl, cancelUrl, payment_method = 'card' } = req.body || {};
  if (!stripeKey) return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  // Map requested payment method to Stripe Checkout supported payment_method_types
  const supported = {
    card: ['card'],
    twint: ['twint'],
  };

  const payment_method_types = supported[payment_method] || ['card'];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'Donation — Pet CV' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || 'http://localhost:3000/?success=1',
      cancel_url: cancelUrl || 'http://localhost:3000/?canceled=1',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'eur' } = req.body || {};
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
