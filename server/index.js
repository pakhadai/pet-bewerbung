require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4242;
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) console.warn('Warning: STRIPE_SECRET_KEY not set. Checkout requests will fail.');
const stripe = Stripe(stripeKey || '');

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

    res.json({ clientSecret: intent.client_secret, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null });
  } catch (err) {
    console.error('PaymentIntent error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.get('/stripe-config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null });
});

app.listen(port, () => console.log(`Stripe helper server listening on http://localhost:${port}`));
