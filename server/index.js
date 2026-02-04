require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Redis = require('ioredis');
const { SignJWT, jwtVerify } = require('jose');

const app = express();
const port = process.env.PORT || 4242;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const isProduction = process.env.NODE_ENV === 'production';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// ============================================
// JWT Configuration for Premium Sessions
// ============================================
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars!'
);
const PREMIUM_DURATION_HOURS = parseInt(process.env.PREMIUM_DURATION_HOURS) || 2;

// Initialize Gemini AI
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// ============================================
// Redis (optional – fallback: file in prod, memory in dev)
// ============================================
let redis = null;
const aiRateLimits = new Map();
const RATE_LIMIT_FILE = process.env.RATE_LIMIT_FILE || path.join(process.cwd(), 'data', 'ai-ratelimit.json');

function readRateLimitFile() {
  try {
    const dir = path.dirname(RATE_LIMIT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(RATE_LIMIT_FILE)) return {};
    const data = fs.readFileSync(RATE_LIMIT_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeRateLimitFile(data) {
  try {
    const dir = path.dirname(RATE_LIMIT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(data), 'utf8');
  } catch (err) {
    if (!isProduction) console.warn('Rate limit file write failed:', err.message);
  }
}

function checkAIRateLimitFile(ip, limit) {
  const now = Date.now();
  const data = readRateLimitFile();
  const record = data[ip];
  const resetTime = record?.resetTime || now + AI_RATE_WINDOW * 1000;
  if (!record || now > record.resetTime) {
    data[ip] = { count: 1, resetTime };
    writeRateLimitFile(data);
    return { allowed: true, remaining: limit - 1, resetTime };
  }
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  record.count++;
  writeRateLimitFile(data);
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

async function initRedis() {
  try {
    redis = new Redis(redisUrl, { maxRetriesPerRequest: 2 });
    redis.on('error', (err) => {
      if (!isProduction) console.warn('Redis error:', err.message);
    });
    await redis.ping();
    if (!isProduction) console.log('✅ Redis connected');
    return true;
  } catch (err) {
    if (isProduction) {
      console.warn('⚠️  Redis unavailable in production. Using file-based rate limiting:', RATE_LIMIT_FILE);
    } else {
      console.warn('⚠️  Redis unavailable, using in-memory rate limiting:', err.message);
    }
    redis = null;
    return false;
  }
}

// ============================================
// Rate Limiting (Redis > file > memory)
// ============================================
const AI_RATE_LIMIT = parseInt(process.env.AI_RATE_LIMIT) || 3;
const AI_RATE_LIMIT_FREE = parseInt(process.env.AI_RATE_LIMIT_FREE) || 1;
const AI_RATE_WINDOW = 24 * 60 * 60; // seconds

async function checkAIRateLimitRedis(ip, limit) {
  const key = `ai:ratelimit:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, AI_RATE_WINDOW);
  const ttl = await redis.ttl(key);
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetTime: Date.now() + ttl * 1000,
  };
}

function checkAIRateLimitMemory(ip, limit) {
  const now = Date.now();
  const record = aiRateLimits.get(ip);
  const resetTime = record?.resetTime || now + AI_RATE_WINDOW * 1000;
  if (!record || now > record.resetTime) {
    aiRateLimits.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

async function checkAIRateLimit(ip, premiumToken = null) {
  const limit = premiumToken ? 9999 : AI_RATE_LIMIT_FREE;
  if (redis) return checkAIRateLimitRedis(ip, limit);
  if (isProduction) return checkAIRateLimitFile(ip, limit);
  return checkAIRateLimitMemory(ip, limit);
}

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
// Set ALLOWED_ORIGINS in .env (comma-separated) to override.
// In production: if ALLOWED_ORIGINS is empty/invalid, use strict defaults (no localhost).
const defaultOriginsDev = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'https://pet.ohmyrevit.pp.ua',
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
];
const defaultOriginsProd = [
  'https://pet-bewerbung.ch',
  'https://www.pet-bewerbung.ch',
  'https://pet.ohmyrevit.pp.ua',
];
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];
const allowedOrigins = isProduction
  ? (envOrigins.length > 0 ? envOrigins : defaultOriginsProd)
  : (envOrigins.length > 0 ? envOrigins : defaultOriginsDev);

app.use(cors({
  origin: (origin, callback) => {
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
    // Build success URL - handle existing query params
    const baseSuccessUrl = successUrl || 'http://localhost:3000';
    const successUrlSeparator = baseSuccessUrl.includes('?') ? '&' : '?';
    const finalSuccessUrl = `${baseSuccessUrl}${successUrlSeparator}session_id={CHECKOUT_SESSION_ID}&payment_success=true`;
    
    // Build cancel URL - handle existing query params
    const baseCancelUrl = cancelUrl || 'http://localhost:3000';
    const cancelUrlSeparator = baseCancelUrl.includes('?') ? '&' : '?';
    const finalCancelUrl = `${baseCancelUrl}${cancelUrlSeparator}payment_canceled=true`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: sessionCurrency,
            product_data: { name: 'Support contribution — Pet CV' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
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

// Available models in order of preference (free tier)
// Fallback chain: if one model hits rate limit, try next
const AI_MODELS = [
  'gemini-2.5-flash-preview-05-20',  // Primary: 10 RPM, 20 RPD
  'gemini-2.0-flash',                 // Fallback 1
  'gemini-1.5-flash',                 // Fallback 2
  'gemini-2.0-flash-lite',            // Fallback 3: lighter model
  'gemma-3-27b-it',                   // Fallback 4: Gemma 30 RPM, 14.4K RPD
];

// ============================================
// AI Input Sanitization (Prompt Injection Protection)
// ============================================
function sanitizePetData(petData) {
  const MAX_FIELD_LENGTH = 100;
  const MAX_TRAITS_LENGTH = 300;
  // Patterns that could be used for prompt injection
  const SUSPICIOUS_PATTERNS = /(\bignore\b|\bforget\b|\bpretend\b|\bact as\b|\bsystem\b|\bprompt\b|\binstructions?\b|\bdisregard\b|\boverride\b|\byou are\b|\bnew role\b)/gi;
  
  const sanitize = (str, maxLen) => {
    if (!str) return '';
    return String(str)
      .slice(0, maxLen)
      .replace(SUSPICIOUS_PATTERNS, '')
      .replace(/[<>{}\\]/g, '') // Remove potentially dangerous characters
      .replace(/\n+/g, ' ')     // Replace newlines with spaces
      .trim();
  };
  
  return {
    petName: sanitize(petData.petName, MAX_FIELD_LENGTH),
    petType: sanitize(petData.petType, 50),
    breed: sanitize(petData.breed, MAX_FIELD_LENGTH),
    age: sanitize(petData.age, 10),
    gender: ['m', 'f'].includes(petData.gender) ? petData.gender : '',
    weight: sanitize(petData.weight, 10),
    traits: sanitize(petData.traits, MAX_TRAITS_LENGTH),
    neutered: Boolean(petData.neutered),
    vaccinated: Boolean(petData.vaccinated),
  };
}

// Tone instructions for different writing styles
const TONE_INSTRUCTIONS = {
  formal: 'Schreibe in einem professionellen, sachlichen Ton.',
  humorous: 'Schreibe mit leichtem Humor und Charme, aber bleibe professionell.',
  cute: 'Schreibe in einem liebevollen, herzlichen Ton.',
};

// Strict prompt template - ONLY generates pet descriptions
function buildPetPrompt(petData, lang, tone = 'formal') {
  const langInstructions = {
    de: {
      lang: 'Antworte auf Deutsch.',
      context: 'Dies ist für eine Schweizer Mietbewerbung. Der Vermieter soll sehen, dass der Mieter verantwortungsvoll ist.'
    },
    en: {
      lang: 'Respond in English.',
      context: 'This is for a Swiss rental application. The landlord should see that the tenant is responsible.'
    },
    fr: {
      lang: 'Réponds en français.',
      context: 'Ceci est pour une demande de location en Suisse. Le propriétaire doit voir que le locataire est responsable.'
    },
    it: {
      lang: 'Rispondi in italiano.',
      context: 'Questo è per una domanda di affitto in Svizzera. Il proprietario deve vedere che l\'inquilino è responsabile.'
    },
    ua: {
      lang: 'Відповідай українською.',
      context: 'Це для заявки на оренду житла у Швейцарії. Орендодавець має побачити, що орендар відповідальний.'
    },
    rm: {
      lang: 'Antworte auf Deutsch.',
      context: 'Dies ist für eine Schweizer Mietbewerbung.'
    },
  };
  
  const instructions = langInstructions[lang] || langInstructions.de;
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.formal;
  
  // Calculate target length based on available data
  const minChars = 420;
  const maxChars = AI_MAX_CHARS; // 470
  
  return `Du bist ein erfahrener Texter, der Mietbewerbungen mit Haustieren in der Schweiz schreibt.

KONTEXT: ${instructions.context}
TON: ${toneInstruction}
WICHTIG: Du schreibst NICHT, um das Tier zu verkaufen! Du schreibst, um den MIETER als verantwortungsvollen Tierhalter zu präsentieren.

STRENGE REGELN:
1. Schreibe einen zusammenhängenden, professionellen Text über das Haustier
2. MINDESTENS ${minChars} Zeichen, MAXIMAL ${maxChars} Zeichen (inklusive Leerzeichen) - NUTZE DEN PLATZ!
3. Beschreibe das Verhalten im Alltag: Wie verhält sich das Tier in der Wohnung? Wann ist es aktiv? Wie reagiert es auf Nachbarn/Besucher?
4. Betone Eigenschaften, die für Vermieter wichtig sind: ruhig, stubenrein, gut erzogen, keine Schäden, kein Lärm
5. Erwähne die Verantwortung des Halters: regelmässige Spaziergänge, Pflege, Erziehung
6. VERMEIDE Phrasen wie "wird eine tolle Ergänzung sein" oder "perfekt für Ihre Wohnung" - das klingt nach Verkauf!
7. KEINE erfundenen Fakten - nutze nur die gegebenen Informationen
8. ${instructions.lang}

HAUSTIER-DATEN (nicht alle im Text wiederholen, nur ergänzen):
- Name: ${petData.petName || 'Unbekannt'}
- Tierart: ${petData.petType || 'Haustier'}
- Rasse: ${petData.breed || 'Unbekannt'}
- Alter: ${petData.age || 'Unbekannt'} Jahre
- Geschlecht: ${petData.gender === 'm' ? 'männlich' : petData.gender === 'f' ? 'weiblich' : 'Unbekannt'}
- Gewicht: ${petData.weight || 'Unbekannt'} kg
- Charakter: ${petData.traits || 'freundlich, ruhig'}
- Kastriert: ${petData.neutered ? 'Ja' : 'Nein'}
- Geimpft: ${petData.vaccinated ? 'Ja' : 'Nein'}

BEISPIEL-STRUKTUR (anpassen, nicht kopieren):
1. Kurze Vorstellung des Charakters
2. Verhalten im Wohnalltag (ruhig, kein Bellen/Miauen, stubenrein)
3. Tagesablauf (wann aktiv, wann ruhig)
4. Verhalten mit Nachbarn/Besuchern
5. Verantwortungsvolle Haltung durch den Besitzer

WICHTIG: Jede Generierung muss EINZIGARTIG sein! Verwende unterschiedliche:
- Satzanfänge und Formulierungen
- Reihenfolge der Informationen
- Beschreibende Adjektive und Verben
- Struktur und Absätze
Variation-Seed: ${Date.now()}-${Math.random().toString(36).substring(2, 8)}

Schreibe jetzt einen professionellen, ausführlichen Text (${minChars}-${maxChars} Zeichen):`;
}

// Try to generate with fallback models
async function generateWithFallback(prompt) {
  let lastError = null;
  
  for (const modelName of AI_MODELS) {
    try {
      if (!isProduction) {
        console.log(`Trying model: ${modelName}`);
      }
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          maxOutputTokens: 350,  // Increased for longer descriptions (420-470 chars)
          temperature: 0.9,     // Higher for unique outputs on each generation
          topP: 0.95,           // More diverse word choices
          topK: 40,             // Consider more token options
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      });
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();
      
      if (!isProduction) {
        console.log(`✅ Success with model: ${modelName}`);
      }
      
      return { text, model: modelName };
      
    } catch (err) {
      lastError = err;
      const errorMsg = err.message || '';
      
      // Check if it's a rate limit or quota error - try next model
      if (errorMsg.includes('429') || 
          errorMsg.includes('quota') || 
          errorMsg.includes('rate') ||
          errorMsg.includes('RESOURCE_EXHAUSTED') ||
          errorMsg.includes('Too Many Requests')) {
        if (!isProduction) {
          console.warn(`⚠️ Rate limit on ${modelName}, trying next...`);
        }
        continue;
      }
      
      // Check if model doesn't exist - try next
      if (errorMsg.includes('404') || 
          errorMsg.includes('not found') ||
          errorMsg.includes('NOT_FOUND') ||
          errorMsg.includes('does not exist')) {
        if (!isProduction) {
          console.warn(`⚠️ Model ${modelName} not found, trying next...`);
        }
        continue;
      }
      
      // For other errors, still try next model but log it
      if (!isProduction) {
        console.warn(`⚠️ Error with ${modelName}: ${errorMsg}, trying next...`);
      }
      continue;
    }
  }
  
  // All models failed
  throw lastError || new Error('All AI models failed');
}

app.post('/generate-pet-description', async (req, res) => {
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   'unknown';
  
  const { petData: rawPetData, lang = 'de', premiumToken, tone = 'formal' } = req.body || {};
  
  if (!rawPetData || !rawPetData.petName) {
    return res.status(400).json({ error: 'Pet data required' });
  }
  
  // SECURITY: Sanitize all input data before processing
  const petData = sanitizePetData(rawPetData);
  
  // Validate sanitized data still has required fields
  if (!petData.petName) {
    return res.status(400).json({ error: 'Invalid pet name after sanitization' });
  }
  
  const rateCheck = await checkAIRateLimit(clientIP, premiumToken);
  
  res.set('X-RateLimit-Limit', AI_RATE_LIMIT_FREE.toString());
  res.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
  res.set('X-RateLimit-Reset', new Date(rateCheck.resetTime).toISOString());
  
  if (!rateCheck.allowed) {
    const resetDate = new Date(rateCheck.resetTime);
    return res.status(429).json({ 
      error: 'Rate limit exceeded', 
      message: `Maximum ${AI_RATE_LIMIT_FREE} AI request(s) per day on free tier.`,
      resetTime: rateCheck.resetTime,
      remaining: 0
    });
  }
  
  if (!genAI) {
    return res.status(503).json({ 
      error: 'AI service not configured',
      message: 'GEMINI_API_KEY not set on server'
    });
  }
  
  try {
    // Sanitize tone to prevent injection
    const safeTone = ['formal', 'humorous', 'cute'].includes(tone) ? tone : 'formal';
    const prompt = buildPetPrompt(petData, lang, safeTone);
    
    // Use fallback system to try multiple models
    const { text: rawText, model: usedModel } = await generateWithFallback(prompt);
    
    // Ensure max length
    let text = rawText;
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
      console.log(`✅ AI generated for ${petData.petName} using ${usedModel} (${text.length} chars), remaining: ${rateCheck.remaining}`);
    }
    
    res.json({ 
      description: text, 
      length: text.length,
      remaining: rateCheck.remaining,
      resetTime: rateCheck.resetTime,
      model: !isProduction ? usedModel : undefined // Only show model in dev
    });
    
  } catch (err) {
    console.error('AI generation error (all models failed):', err.message);
    
    // Refund rate limit on error
    if (redis) {
      const key = `ai:ratelimit:${clientIP}`;
      const count = await redis.get(key);
      if (count && parseInt(count, 10) > 0) await redis.decr(key);
    } else if (aiRateLimits.has(clientIP)) {
      const record = aiRateLimits.get(clientIP);
      if (record && record.count > 0) record.count--;
    }
    
    res.status(500).json({ 
      error: 'AI generation failed',
      message: err.message || 'All AI models unavailable. Please try again later.',
      remaining: rateCheck.remaining + 1 // Refund the request
    });
  }
});

// Check remaining AI requests
app.get('/ai-rate-limit', async (req, res) => {
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   'unknown';
  
  if (redis) {
    try {
      const key = `ai:ratelimit:${clientIP}`;
      const count = parseInt(await redis.get(key) || '0', 10);
      const ttl = await redis.ttl(key);
      return res.json({ 
        limit: AI_RATE_LIMIT_FREE, 
        remaining: Math.max(0, AI_RATE_LIMIT_FREE - count), 
        resetTime: ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + AI_RATE_WINDOW * 1000,
        configured: !!genAI
      });
    } catch {
      // fall through
    }
  }
  
  const now = Date.now();
  const record = aiRateLimits.get(clientIP);
  
  if (!record || now > record.resetTime) {
    return res.json({ 
      limit: AI_RATE_LIMIT_FREE, 
      remaining: AI_RATE_LIMIT_FREE, 
      resetTime: now + AI_RATE_WINDOW * 1000,
      configured: !!genAI
    });
  }
  
  res.json({ 
    limit: AI_RATE_LIMIT_FREE, 
    remaining: Math.max(0, AI_RATE_LIMIT_FREE - record.count), 
    resetTime: record.resetTime,
    configured: !!genAI
  });
});

// ============================================
// Magic Rewrite - Premium Feature
// Improves user-written text with AI
// ============================================
app.post('/improve-text', async (req, res) => {
  const { text, tone = 'formal', premiumToken, deviceId } = req.body || {};
  
  // Require premium token for this endpoint
  if (!premiumToken || !deviceId) {
    return res.status(401).json({ error: 'Premium token required', code: 'NO_TOKEN' });
  }
  
  // Verify premium token
  const verification = await verifyPremiumToken(premiumToken, deviceId);
  if (!verification.valid) {
    return res.status(401).json({ 
      error: verification.error === 'expired' ? 'Premium session expired' : 
             verification.error === 'device_mismatch' ? 'Token bound to different device' : 
             'Invalid premium token',
      code: verification.error?.toUpperCase() || 'INVALID'
    });
  }
  
  if (!text || text.trim().length < 20) {
    return res.status(400).json({ error: 'Text too short (minimum 20 characters)' });
  }
  
  if (!genAI) {
    return res.status(503).json({ error: 'AI service not configured' });
  }
  
  try {
    const safeTone = ['formal', 'humorous', 'cute'].includes(tone) ? tone : 'formal';
    const toneInstruction = TONE_INSTRUCTIONS[safeTone] || TONE_INSTRUCTIONS.formal;
    
    // Sanitize input text
    const sanitizedText = text
      .slice(0, 1000)
      .replace(/[<>{}]/g, '')
      .trim();
    
    const prompt = `Du bist ein erfahrener Texter für Schweizer Mietbewerbungen mit Haustieren.

AUFGABE: Verbessere den folgenden Text professionell.
TON: ${toneInstruction}

REGELN:
1. Behalte alle wichtigen Informationen bei
2. Verbessere Grammatik und Stil
3. Mache den Text professioneller und überzeugender
4. Maximal 470 Zeichen (inklusive Leerzeichen)
5. Keine neuen Informationen hinzufügen
6. Vermeide Marketing-Sprache ("perfekt", "ideal", "beste Wahl")

ORIGINALTEXT:
"${sanitizedText}"

Verbesserter Text:`;

    const { text: improvedText, model } = await generateWithFallback(prompt);
    
    // Clean up the response
    let finalText = improvedText
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .trim();
    
    if (finalText.length > AI_MAX_CHARS) {
      const cutText = finalText.substring(0, AI_MAX_CHARS);
      const lastSentenceEnd = Math.max(
        cutText.lastIndexOf('.'),
        cutText.lastIndexOf('!'),
        cutText.lastIndexOf('?')
      );
      finalText = lastSentenceEnd > AI_MAX_CHARS * 0.6 
        ? cutText.substring(0, lastSentenceEnd + 1) 
        : cutText.substring(0, AI_MAX_CHARS - 3) + '...';
    }
    
    if (!isProduction) {
      console.log(`✅ Text improved using ${model} (${finalText.length} chars)`);
    }
    
    res.json({ 
      improvedText: finalText,
      length: finalText.length,
      model: !isProduction ? model : undefined
    });
    
  } catch (err) {
    console.error('Text improvement error:', err.message);
    res.status(500).json({ error: 'Failed to improve text' });
  }
});

// ============================================
// Premium Purchase Restoration
// ============================================
// Generate a restore token for email after successful premium purchase
function generateRestoreToken(sessionId) {
  // Simple token: base64 of session ID + timestamp
  const payload = JSON.stringify({ 
    sid: sessionId, 
    ts: Date.now(),
    exp: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year expiry
  });
  return Buffer.from(payload).toString('base64url');
}

// Verify restore token
function verifyRestoreToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString());
    if (!payload.sid || !payload.exp) return null;
    if (Date.now() > payload.exp) return null; // Expired
    return payload;
  } catch {
    return null;
  }
}

// Endpoint to verify restore token and return session info
app.get('/verify-restore/:token', async (req, res) => {
  const { token } = req.params;
  
  const payload = verifyRestoreToken(token);
  if (!payload) {
    return res.status(400).json({ valid: false, error: 'Invalid or expired token' });
  }
  
  if (!stripeKey) {
    return res.status(400).json({ valid: false, error: 'Stripe not configured' });
  }
  
  try {
    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(payload.sid);
    
    if (session.payment_status === 'paid') {
      return res.json({ 
        valid: true, 
        sessionId: session.id,
        purchaseDate: new Date(session.created * 1000).toISOString()
      });
    } else {
      return res.json({ valid: false, error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Restore verification error:', err.message);
    return res.status(404).json({ valid: false, error: 'Session not found' });
  }
});

// Endpoint to generate restore link (called after successful payment)
app.post('/generate-restore-link', async (req, res) => {
  const { sessionId, email } = req.body || {};
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  if (!stripeKey) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }
  
  try {
    // Verify payment was successful
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    
    const token = generateRestoreToken(sessionId);
    const restoreUrl = `${process.env.FRONTEND_URL || 'https://pet-bewerbung.ch'}?restore=${token}`;
    
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
});

// ============================================
// JWT Premium Session Management
// ============================================

/**
 * Create a premium JWT token with device binding
 * @param {string} sessionId - Stripe session ID
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
 * @returns {Promise<{valid: boolean, payload?: object, error?: string, timeRemaining?: number}>}
 */
async function verifyPremiumToken(token, deviceId) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check device binding
    if (payload.did !== deviceId) {
      return { valid: false, error: 'device_mismatch' };
    }
    
    // Calculate time remaining
    const exp = payload.exp * 1000; // Convert to milliseconds
    const timeRemaining = Math.max(0, exp - Date.now());
    
    return { valid: true, payload, timeRemaining };
  } catch (err) {
    if (err.code === 'ERR_JWT_EXPIRED') {
      return { valid: false, error: 'expired' };
    }
    return { valid: false, error: 'invalid' };
  }
}

// POST /activate-premium - Called after successful Stripe payment to get JWT
// Accepts either sessionId (Checkout Session) or paymentIntentId (Payment Intent)
app.post('/activate-premium', async (req, res) => {
  const { sessionId, paymentIntentId, deviceId } = req.body || {};
  
  const paymentId = sessionId || paymentIntentId;
  
  if (!paymentId || !deviceId) {
    return res.status(400).json({ error: 'Payment ID and Device ID required' });
  }
  
  if (!stripeKey) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }
  
  try {
    let paymentVerified = false;
    let verifiedId = paymentId;
    
    // Try to verify as Checkout Session first (starts with cs_)
    if (paymentId.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(paymentId);
      paymentVerified = session.payment_status === 'paid';
      verifiedId = paymentId;
    } 
    // Otherwise try as Payment Intent (starts with pi_)
    else if (paymentId.startsWith('pi_')) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      paymentVerified = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
      verifiedId = paymentId;
    }
    // Fallback: try both
    else {
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
    
    // Create JWT token with device binding
    const token = await createPremiumToken(verifiedId, deviceId);
    const expiresIn = PREMIUM_DURATION_HOURS * 3600; // seconds
    
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
});

// POST /verify-premium - Verify token for premium actions
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

// Middleware to check premium token (for protected endpoints)
const requirePremium = async (req, res, next) => {
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
};

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

initRedis().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Pet-Bewerbung server running on http://localhost:${port}`);
    console.log(`📍 Environment: ${isProduction ? 'PRODUCTION' : 'development'}`);
    if (!isProduction) {
      console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
    }
  });
});
