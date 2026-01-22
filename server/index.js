require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 4242;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Gemini AI
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// ============================================
// Rate Limiting for AI Generation (IP-based)
// ============================================
// NOTE: Rate limits are stored in memory (Map).
// - If server restarts, limits reset (acceptable for MVP)
// - For multi-instance scaling, use Redis or database
// - For production with high traffic, consider Redis-based rate limiting
const AI_RATE_LIMIT = parseInt(process.env.AI_RATE_LIMIT) || 3; // requests per day
const AI_RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms
const aiRateLimits = new Map(); // IP -> { count, resetTime }

function checkAIRateLimit(ip) {
  const now = Date.now();
  const record = aiRateLimits.get(ip);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    aiRateLimits.set(ip, { count: 1, resetTime: now + AI_RATE_WINDOW });
    return { allowed: true, remaining: AI_RATE_LIMIT - 1, resetTime: now + AI_RATE_WINDOW };
  }
  
  if (record.count >= AI_RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: AI_RATE_LIMIT - record.count, resetTime: record.resetTime };
}

// Clean up old rate limit records every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of aiRateLimits.entries()) {
    if (now > record.resetTime) {
      aiRateLimits.delete(ip);
    }
  }
}, 60 * 60 * 1000);

if (!stripeKey) {
  console.warn('⚠️  Warning: STRIPE_SECRET_KEY not set. Checkout requests will fail.');
  console.warn('   Please set STRIPE_SECRET_KEY in .env file or environment variables.');
} else {
  if (!isProduction) {
    console.log('✅ STRIPE_SECRET_KEY is configured (length:', stripeKey.length, 'chars)');
  }
}
const stripe = Stripe(stripeKey || '');

// ============================================
// SECURITY: CORS Configuration
// ============================================
// IMPORTANT: Update these domains if your production domain changes
// If domain changes, API will reject requests from new domain
// Add new production domains here before deploying
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
  
  // Check Stripe key
  if (!stripeKey) {
    if (!isProduction) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
    }
    return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  }
  
  // Validate amount
  if (!amount || amount <= 0) {
    if (!isProduction) {
      console.error('❌ Invalid amount:', amount);
    }
    return res.status(400).json({ error: 'Invalid amount' });
  }

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
});

// ============================================
// Payment Intent (for embedded form)
// ============================================
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'chf' } = req.body || {};
  if (!stripeKey) return res.status(400).json({ error: 'STRIPE_SECRET_KEY not configured on server.' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    // Explicitly set payment methods to disable Link (save card feature)
    // Link only works with automatic_payment_methods, so we use explicit list
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      // Explicit payment methods - NO Link!
      payment_method_types: ['card', 'twint'],
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
// Get payment status from Stripe API
// Automatically detects pi_ (PaymentIntent) or cs_ (CheckoutSession) and calls appropriate method
// ============================================
app.get('/payment-status/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!stripeKey) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  try {
    // Detect type by prefix: pi_ = PaymentIntent, cs_ = CheckoutSession
    if (id.startsWith('pi_')) {
      // PaymentIntent
      const intent = await stripe.paymentIntents.retrieve(id);
      res.json({ 
        id, 
        type: 'payment_intent',
        status: intent.status,
        amount: intent.amount,
        currency: intent.currency
      });
    } else if (id.startsWith('cs_')) {
      // CheckoutSession
      const session = await stripe.checkout.sessions.retrieve(id);
      res.json({ 
        id, 
        type: 'checkout_session',
        status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
        amount: session.amount_total,
        currency: session.currency
      });
    } else {
      // Unknown type - try both (for backward compatibility)
      try {
        const intent = await stripe.paymentIntents.retrieve(id);
        res.json({ 
          id, 
          type: 'payment_intent',
          status: intent.status,
          amount: intent.amount,
          currency: intent.currency
        });
      } catch (intentErr) {
        try {
          const session = await stripe.checkout.sessions.retrieve(id);
          res.json({ 
            id, 
            type: 'checkout_session',
            status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
            amount: session.amount_total,
            currency: session.currency
          });
        } catch (sessionErr) {
          throw new Error('Invalid payment ID format');
        }
      }
    }
  } catch (err) {
    console.error('Error retrieving payment status:', err.message);
    res.status(404).json({ id, status: null, error: err.message });
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
// AI Pet Description Generation (Gemini)
// ============================================
const AI_MAX_CHARS = 470;

// Strict prompt template - ONLY generates pet descriptions
function buildPetPrompt(petData, lang) {
  const langInstructions = {
    de: 'Antworte auf Deutsch.',
    en: 'Respond in English.',
    fr: 'Réponds en français.',
    it: 'Rispondi in italiano.',
    ua: 'Відповідай українською.',
    rm: 'Antworte auf Deutsch.', // Romansh -> German
  };
  
  const langInstruction = langInstructions[lang] || langInstructions.de;
  
  return `Du bist ein professioneller Texter für Mietbewerbungen mit Haustieren in der Schweiz.

STRENGE REGELN:
1. Schreibe NUR eine Beschreibung für das Haustier - KEINE anderen Themen
2. Maximal ${AI_MAX_CHARS} Zeichen (inklusive Leerzeichen)
3. Professioneller, freundlicher Ton
4. Betone positive Eigenschaften für Vermieter (ruhig, stubenrein, gut erzogen)
5. KEINE erfundenen Fakten - nutze nur die gegebenen Informationen
6. ${langInstruction}

HAUSTIER-DATEN:
- Name: ${petData.petName || 'Unbekannt'}
- Tierart: ${petData.petType || 'Haustier'}
- Rasse: ${petData.breed || 'Unbekannt'}
- Alter: ${petData.age || 'Unbekannt'}
- Geschlecht: ${petData.gender || 'Unbekannt'}
- Gewicht: ${petData.weight || 'Unbekannt'}
- Eigenschaften: ${petData.traits || 'freundlich, ruhig'}
- Kastriert/Sterilisiert: ${petData.neutered ? 'Ja' : 'Nein'}
- Geimpft: ${petData.vaccinated ? 'Ja' : 'Nein'}

Schreibe jetzt eine überzeugende, professionelle Beschreibung für dieses Haustier, die Vermieter anspricht:`;
}

app.post('/generate-pet-description', async (req, res) => {
  // Get client IP (considering proxies)
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   'unknown';
  
  // Check rate limit
  const rateCheck = checkAIRateLimit(clientIP);
  
  // Set rate limit headers
  res.set('X-RateLimit-Limit', AI_RATE_LIMIT.toString());
  res.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
  res.set('X-RateLimit-Reset', new Date(rateCheck.resetTime).toISOString());
  
  if (!rateCheck.allowed) {
    const resetDate = new Date(rateCheck.resetTime);
    return res.status(429).json({ 
      error: 'Rate limit exceeded', 
      message: `Maximum ${AI_RATE_LIMIT} AI requests per day. Try again after ${resetDate.toLocaleTimeString()}.`,
      resetTime: rateCheck.resetTime,
      remaining: 0
    });
  }
  
  // Check if Gemini is configured
  if (!genAI) {
    return res.status(503).json({ 
      error: 'AI service not configured',
      message: 'GEMINI_API_KEY not set on server'
    });
  }
  
  const { petData, lang = 'de' } = req.body || {};
  
  if (!petData || !petData.petName) {
    return res.status(400).json({ error: 'Pet data required' });
  }
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });
    
    const prompt = buildPetPrompt(petData, lang);
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();
    
    // Ensure max length
    if (text.length > AI_MAX_CHARS) {
      // Try to cut at sentence boundary
      const cutText = text.substring(0, AI_MAX_CHARS);
      const lastSentenceEnd = Math.max(
        cutText.lastIndexOf('.'),
        cutText.lastIndexOf('!'),
        cutText.lastIndexOf('?')
      );
      text = lastSentenceEnd > AI_MAX_CHARS * 0.6 
        ? cutText.substring(0, lastSentenceEnd + 1) 
        : cutText.substring(0, AI_MAX_CHARS - 3) + '...';
    }
    
    if (!isProduction) {
      console.log(`AI generated description for ${petData.petName} (${text.length} chars), remaining: ${rateCheck.remaining}`);
    }
    
    res.json({ 
      description: text, 
      length: text.length,
      remaining: rateCheck.remaining,
      resetTime: rateCheck.resetTime
    });
    
  } catch (err) {
    console.error('AI generation error:', err.message);
    
    // Don't count failed requests against rate limit
    const record = aiRateLimits.get(clientIP);
    if (record && record.count > 0) {
      record.count--;
    }
    
    res.status(500).json({ 
      error: 'AI generation failed',
      message: err.message || 'Unknown error',
      remaining: rateCheck.remaining + 1 // Refund the request
    });
  }
});

// Check remaining AI requests
app.get('/ai-rate-limit', (req, res) => {
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   'unknown';
  
  const now = Date.now();
  const record = aiRateLimits.get(clientIP);
  
  if (!record || now > record.resetTime) {
    return res.json({ 
      limit: AI_RATE_LIMIT, 
      remaining: AI_RATE_LIMIT, 
      resetTime: now + AI_RATE_WINDOW,
      configured: !!genAI
    });
  }
  
  res.json({ 
    limit: AI_RATE_LIMIT, 
    remaining: Math.max(0, AI_RATE_LIMIT - record.count), 
    resetTime: record.resetTime,
    configured: !!genAI
  });
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
