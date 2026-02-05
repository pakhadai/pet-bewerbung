/**
 * AI Controller
 * Handles pet description generation and text improvement
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { 
  GEMINI_API_KEY, 
  AI_MODELS, 
  AI_MAX_CHARS, 
  AI_RATE_LIMIT_FREE,
  isProduction 
} = require('../config');
const { sanitizePetData, sanitizeText, sanitizeTone } = require('../utils/sanitize');
const { 
  checkAIRateLimit, 
  refundRateLimit, 
  getRateLimitStatus, 
  getClientIP 
} = require('../middleware/rateLimit');
const { verifyPremiumToken } = require('../middleware/premium');

// Initialize Gemini AI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Tone instructions
const TONE_INSTRUCTIONS = {
  formal: 'Schreibe in einem professionellen, sachlichen Ton.',
  humorous: 'Schreibe mit leichtem Humor und Charme, aber bleibe professionell.',
  cute: 'Schreibe in einem liebevollen, herzlichen Ton.',
};

// Language instructions
const LANG_INSTRUCTIONS = {
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

/**
 * Build prompt for pet description generation
 */
function buildPetPrompt(petData, lang, tone = 'formal') {
  const instructions = LANG_INSTRUCTIONS[lang] || LANG_INSTRUCTIONS.de;
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.formal;
  const minChars = 420;
  const maxChars = AI_MAX_CHARS;
  
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

/**
 * Try to generate with fallback models
 */
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
          maxOutputTokens: 350,
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
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
      
      if (errorMsg.includes('404') || 
          errorMsg.includes('not found') ||
          errorMsg.includes('NOT_FOUND') ||
          errorMsg.includes('does not exist')) {
        if (!isProduction) {
          console.warn(`⚠️ Model ${modelName} not found, trying next...`);
        }
        continue;
      }
      
      if (!isProduction) {
        console.warn(`⚠️ Error with ${modelName}: ${errorMsg}, trying next...`);
      }
      continue;
    }
  }
  
  throw lastError || new Error('All AI models failed');
}

/**
 * Truncate text to max length at sentence boundary
 */
function truncateAtSentence(text, maxLen) {
  if (text.length <= maxLen) return text;
  
  const cutText = text.substring(0, maxLen);
  const lastSentenceEnd = Math.max(
    cutText.lastIndexOf('.'),
    cutText.lastIndexOf('!'),
    cutText.lastIndexOf('?')
  );
  
  return lastSentenceEnd > maxLen * 0.6 
    ? cutText.substring(0, lastSentenceEnd + 1) 
    : cutText.substring(0, maxLen - 3) + '...';
}

/**
 * Generate pet description
 */
async function generatePetDescription(req, res) {
  const clientIP = getClientIP(req);
  const { petData: rawPetData, lang = 'de', premiumToken, tone = 'formal' } = req.body || {};
  
  if (!rawPetData || !rawPetData.petName) {
    return res.status(400).json({ error: 'Pet data required' });
  }
  
  const petData = sanitizePetData(rawPetData);
  
  if (!petData.petName) {
    return res.status(400).json({ error: 'Invalid pet name after sanitization' });
  }
  
  const rateCheck = await checkAIRateLimit(clientIP, premiumToken);
  
  res.set('X-RateLimit-Limit', AI_RATE_LIMIT_FREE.toString());
  res.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
  res.set('X-RateLimit-Reset', new Date(rateCheck.resetTime).toISOString());
  
  if (!rateCheck.allowed) {
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
    const safeTone = sanitizeTone(tone);
    const prompt = buildPetPrompt(petData, lang, safeTone);
    const { text: rawText, model: usedModel } = await generateWithFallback(prompt);
    const text = truncateAtSentence(rawText, AI_MAX_CHARS);
    
    if (!isProduction) {
      console.log(`✅ AI generated for ${petData.petName} using ${usedModel} (${text.length} chars), remaining: ${rateCheck.remaining}`);
    }
    
    res.json({ 
      description: text, 
      length: text.length,
      remaining: rateCheck.remaining,
      resetTime: rateCheck.resetTime,
      model: !isProduction ? usedModel : undefined
    });
    
  } catch (err) {
    console.error('AI generation error (all models failed):', err.message);
    await refundRateLimit(clientIP);
    
    res.status(500).json({ 
      error: 'AI generation failed',
      message: err.message || 'All AI models unavailable. Please try again later.',
      remaining: rateCheck.remaining + 1
    });
  }
}

/**
 * Get AI rate limit status
 */
async function getAIRateLimitStatus(req, res) {
  const clientIP = getClientIP(req);
  const status = await getRateLimitStatus(clientIP);
  
  res.json({
    ...status,
    configured: !!genAI
  });
}

/**
 * Improve text (Premium feature)
 */
async function improveText(req, res) {
  const { text, tone = 'formal', premiumToken, deviceId } = req.body || {};
  
  if (!premiumToken || !deviceId) {
    return res.status(401).json({ error: 'Premium token required', code: 'NO_TOKEN' });
  }
  
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
    const safeTone = sanitizeTone(tone);
    const toneInstruction = TONE_INSTRUCTIONS[safeTone] || TONE_INSTRUCTIONS.formal;
    const sanitizedText = sanitizeText(text, 1000);
    
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
    
    let finalText = improvedText
      .replace(/^["']|["']$/g, '')
      .trim();
    
    finalText = truncateAtSentence(finalText, AI_MAX_CHARS);
    
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
}

module.exports = {
  generatePetDescription,
  getAIRateLimitStatus,
  improveText,
};
