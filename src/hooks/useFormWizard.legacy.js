import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TEMPLATE_OPTIONS, TRANSLATIONS, INITIAL_DATA, PREMIUM_PRICE_CHF } from '../constants';
import { validateSwissPhone, validateSwissPostal, validateEmail } from '../utils/swissValidation';

const PREMIUM_TOKEN_KEY = 'pet-bewerbung-premium-token';
const PREMIUM_EXPIRY_KEY = 'pet-bewerbung-premium-expiry';
const DEVICE_ID_KEY = 'pet-bewerbung-device-id';
const AI_GENERATIONS_KEY = 'pet-bewerbung-ai-generations';
const PREMIUM_AI_GENERATIONS_KEY = 'pet-bewerbung-premium-ai-generations';

// Generate or retrieve a stable device ID
const getDeviceId = () => {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      // Try crypto.randomUUID first (modern browsers)
      if (crypto && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else if (crypto && crypto.getRandomValues) {
        // Fallback to crypto.getRandomValues for better security
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        id = 'device-' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      } else {
        // Last resort: Math.random (not cryptographically secure)
        console.warn('⚠️  Using weak random for device ID - crypto API not available');
        id = 'device-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (e) {
    // If all fails, generate temporary ID (won't persist)
    console.error('Device ID generation failed:', e);
    return 'temp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
  }
};

const STORAGE_KEY = 'pet-bewerbung-form-data';
const STORAGE_STEP_KEY = 'pet-bewerbung-step';

const detectLang = () => {
  try {
    const nav = (navigator && (navigator.language || navigator.userLanguage) || '').slice(0, 2).toLowerCase();
    if (nav === 'uk') return 'ua';
    if (['de', 'fr', 'it', 'rm', 'en', 'ua'].includes(nav)) return nav;
  } catch (e) {
    // ignore
  }
  return INITIAL_DATA.lang || 'de';
};

/**
 * Load saved form data from localStorage
 */
const loadSavedData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with INITIAL_DATA to ensure all fields exist
      return { ...INITIAL_DATA, ...parsed, lang: parsed.lang || detectLang() };
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Could not load saved form data:', e);
    }
  }
  return { ...INITIAL_DATA, lang: detectLang() };
};

/**
 * Load saved step from localStorage
 */
const loadSavedStep = () => {
  try {
    const saved = localStorage.getItem(STORAGE_STEP_KEY);
    if (saved) {
      const step = parseInt(saved, 10);
      // Don't restore step 0 (landing) or step 6 (thank you)
      if (step >= 1 && step <= 5) {
        return step;
      }
    }
  } catch (e) {
    // ignore
  }
  return 0;
};

export const useFormWizard = () => {
  const [step, setStep] = useState(() => loadSavedStep());
  const [data, setData] = useState(() => loadSavedData());
  const [animDir, setAnimDir] = useState('left');
  const prevStepRef = useRef(step);

  // Translations
  const t = TRANSLATIONS[data.lang] || TRANSLATIONS.de;

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      // Don't save photo data to localStorage (too large)
      const dataToSave = { ...data };
      if (dataToSave.photoPreview && dataToSave.photoPreview.length > 50000) {
        // If photo is too large, store a flag instead
        console.warn('⚠️  Photo too large for localStorage (>50KB). Photo will not persist on page refresh.');
        dataToSave.photoPreview = '';
        dataToSave.hasPhotoSaved = false;
        // Flag to indicate photo was dropped (can be used to show warning in UI)
        dataToSave.photoTooLarge = true;
      } else {
        dataToSave.photoTooLarge = false;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Could not save form data to localStorage:', e);
      }
    }
  }, [data]);

  // Save step to localStorage when it changes
  useEffect(() => {
    try {
      // Don't save step 0 (landing) or step 6 (thank you)
      if (step >= 1 && step <= 5) {
        localStorage.setItem(STORAGE_STEP_KEY, String(step));
      } else {
        localStorage.removeItem(STORAGE_STEP_KEY);
      }
    } catch (e) {
      // ignore
    }
  }, [step]);

  // Update single field
  const updateData = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update multiple fields at once
  const updateMultipleData = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  // Navigate to step
  const goToStep = useCallback((newStep) => {
    setAnimDir(newStep > prevStepRef.current ? 'right' : 'left');
    prevStepRef.current = newStep;
    setStep(newStep);
    // Scroll to top so the next step is visible from the start
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigation helpers
  const nextStep = useCallback(() => goToStep(step + 1), [step, goToStep]);
  const prevStep = useCallback(() => goToStep(step - 1), [step, goToStep]);

  // Clear all saved data and reset to initial state
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
    } catch (e) {
      // ignore
    }
    setData({ ...INITIAL_DATA, lang: data.lang });
    setStep(0);
  }, [data.lang]);

  // Clear generated text when language changes
  const prevLangRef = useRef(data.lang);
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      updateData('generatedText', '');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, updateData]);

  return {
    step,
    setStep,
    data,
    setData,
    animDir,
    t,
    updateData,
    updateMultipleData,
    goToStep,
    nextStep,
    prevStep,
    clearSavedData
  };
};

export const useTemplateSelection = (initialTemplate = TEMPLATE_OPTIONS[0].id) => {
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(initialTemplate);

  const openPreview = useCallback((templateId) => {
    setPreviewTemplate(templateId);
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  return {
    selectedTemplate,
    setSelectedTemplate,
    previewOpen,
    previewTemplate,
    openPreview,
    closePreview
  };
};

export const usePaymentFlow = () => {
  const [donationAmount, setDonationAmount] = useState('5');
  const [donateOpen, setDonateOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const openDonate = useCallback((amount) => {
    if (amount) setDonationAmount(String(amount));
    setDonateOpen(true);
  }, []);

  const closeDonate = useCallback(() => {
    setDonateOpen(false);
  }, []);

  const openPayment = useCallback(() => {
    setPaymentOpen(true);
    setDonateOpen(false);
  }, []);

  const closePayment = useCallback(() => {
    setPaymentOpen(false);
  }, []);

  return {
    donationAmount,
    setDonationAmount,
    donateOpen,
    setDonateOpen,
    paymentOpen,
    setPaymentOpen,
    openDonate,
    closeDonate,
    openPayment,
    closePayment
  };
};

export const useToast = (duration = 5000) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((msg, type = 'info') => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ msg, type });
    timeoutRef.current = setTimeout(() => setToast(null), duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { toast, showToast, hideToast };
};

export const useScrollVisibility = (threshold = 120) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);
      setIsVisible(nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial state
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return isVisible;
};

/**
 * Form validation hook - validates data for each step
 * @param {Object} data - Form data
 * @param {number} step - Current step
 * @returns {Object} - Validation state
 */
export const useFormValidation = (data, step) => {
  const validation = useMemo(() => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 1: // Details (Owner + Pet)
        if (!data.ownerName || data.ownerName.trim().length < 2) {
          errors.ownerName = true;
          isValid = false;
        }
        if (data.email && !validateEmail(data.email)) {
          errors.email = true;
          isValid = false;
        }
        if (data.phone && !validateSwissPhone(data.phone)) {
          errors.phone = true;
          isValid = false;
        }
        if (data.postal && !validateSwissPostal(data.postal)) {
          errors.postal = true;
          isValid = false;
        }
        if (!data.name || data.name.trim().length < 1) {
          errors.name = true;
          isValid = false;
        }
        if (!data.petType) {
          errors.petType = true;
          isValid = false;
        }
        break;

      case 2: // Emergency - optional
      case 3: // Upload & Select - optional
      case 4: // Summary - no validation
      case 5: // Preview - no validation
        break;

      default:
        break;
    }

    return { errors, isValid };
  }, [data, step]);

  return validation;
};

/**
 * Premium state management hook with JWT tokens and device binding
 * - 2-hour session duration
 * - Device-bound tokens (can't share with friends)
 * - Server-side verification
 * @returns {Object} - Premium state and handlers
 */
export const usePremium = () => {
  // Stable device ID for token binding
  const deviceId = useMemo(() => getDeviceId(), []);
  
  // Load token and expiry from localStorage
  const [premiumToken, setPremiumToken] = useState(() => {
    try {
      return localStorage.getItem(PREMIUM_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  });
  
  const [tokenExpiry, setTokenExpiry] = useState(() => {
    try {
      const saved = localStorage.getItem(PREMIUM_EXPIRY_KEY);
      return saved ? parseInt(saved, 10) : null;
    } catch (e) {
      return null;
    }
  });
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState(null);
  
  // Calculate if premium is active (has token and not expired)
  const isPremium = useMemo(() => {
    if (!premiumToken) return false;
    if (tokenExpiry && Date.now() > tokenExpiry) return false;
    return true;
  }, [premiumToken, tokenExpiry]);
  
  // Time remaining in milliseconds
  const timeRemaining = useMemo(() => {
    if (!isPremium || !tokenExpiry) return 0;
    return Math.max(0, tokenExpiry - Date.now());
  }, [isPremium, tokenExpiry]);
  
  // Clear expired token on mount and periodically
  useEffect(() => {
    const checkExpiry = () => {
      if (tokenExpiry && Date.now() > tokenExpiry) {
        clearPremium();
      }
    };
    
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tokenExpiry]);
  
  // Clear premium data
  const clearPremium = useCallback(() => {
    try {
      localStorage.removeItem(PREMIUM_TOKEN_KEY);
      localStorage.removeItem(PREMIUM_EXPIRY_KEY);
    } catch (e) {
      // ignore
    }
    setPremiumToken(null);
    setTokenExpiry(null);
  }, []);
  
  // Activate premium after successful payment
  // Accepts either sessionId (Checkout) or paymentIntentId (Payment Elements)
  const activatePremium = useCallback(async (paymentId) => {
    setIsVerifying(true);
    try {
      // Determine the type of ID and send appropriately
      const body = { deviceId };
      if (paymentId?.startsWith('cs_')) {
        body.sessionId = paymentId;
      } else if (paymentId?.startsWith('pi_')) {
        body.paymentIntentId = paymentId;
      } else {
        // Fallback - try both names
        body.sessionId = paymentId;
        body.paymentIntentId = paymentId;
      }
      
      const response = await fetch('/api/activate-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        const expiry = data.expiresAt || (Date.now() + data.expiresIn * 1000);
        
        try {
          localStorage.setItem(PREMIUM_TOKEN_KEY, data.token);
          localStorage.setItem(PREMIUM_EXPIRY_KEY, String(expiry));
        } catch (e) {
          // ignore
        }
        
        setPremiumToken(data.token);
        setTokenExpiry(expiry);
        
        if (import.meta.env.DEV) {
          console.log('✅ Premium activated, expires in:', Math.round(data.expiresIn / 60), 'minutes');
        }
        
        return true;
      } else {
        if (import.meta.env.DEV) {
          console.warn('Premium activation failed:', data.error);
        }
        return false;
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Premium activation error:', e);
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [deviceId]);
  
  // Verify current token with server
  const verifyToken = useCallback(async () => {
    if (!premiumToken) return false;
    
    try {
      const response = await fetch('/api/verify-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: premiumToken, deviceId })
      });
      
      const data = await response.json();
      
      if (!data.valid) {
        clearPremium();
        return false;
      }
      
      // Update expiry if server provides it
      if (data.timeRemaining) {
        const newExpiry = Date.now() + data.timeRemaining;
        setTokenExpiry(newExpiry);
        try {
          localStorage.setItem(PREMIUM_EXPIRY_KEY, String(newExpiry));
        } catch (e) {
          // ignore
        }
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }, [premiumToken, deviceId, clearPremium]);
  
  // Check if selected template requires premium
  const isTemplateAccessible = useCallback((templateId) => {
    const template = TEMPLATE_OPTIONS.find(t => t.id === templateId);
    if (!template) return true;
    if (!template.isPremium) return true;
    return isPremium;
  }, [isPremium]);

  // Get template info with premium status
  const getTemplateInfo = useCallback((templateId) => {
    const template = TEMPLATE_OPTIONS.find(t => t.id === templateId);
    if (!template) return { isPremium: false, price: 0, accessible: true };
    return {
      ...template,
      accessible: !template.isPremium || isPremium
    };
  }, [isPremium]);

  return {
    isPremium,
    premiumToken,
    deviceId,
    activatePremium,
    clearPremium,
    verifyToken,
    isVerifying,
    isTemplateAccessible,
    getTemplateInfo,
    premiumPrice: PREMIUM_PRICE_CHF,
    timeRemaining,
    restoreStatus
  };
};

/**
 * AI generation limits hook for free users
 * Tracks local AI generation count (complementary to server-side rate limiting)
 * @returns {Object} - Generation state and handlers
 */
export const useAIGenerations = (isPremium = false) => {
  const FREE_LIMIT = 1; // Free users get 1 generation per session
  const PREMIUM_LIMIT = 20; // Premium users get 20 generations

  // Free user generation count
  const [generationCount, setGenerationCount] = useState(() => {
    try {
      const saved = localStorage.getItem(AI_GENERATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset if from a different day
        const today = new Date().toDateString();
        if (parsed.date === today) {
          return parsed.count;
        }
      }
    } catch (e) {
      // ignore
    }
    return 0;
  });

  // Premium user generation count
  const [premiumGenerationCount, setPremiumGenerationCount] = useState(() => {
    try {
      const saved = localStorage.getItem(PREMIUM_AI_GENERATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset if from a different day
        const today = new Date().toDateString();
        if (parsed.date === today) {
          return parsed.count;
        }
      }
    } catch (e) {
      // ignore
    }
    return 0;
  });

  // Save generation count (different for premium vs free)
  const incrementGeneration = useCallback(() => {
    if (isPremium) {
      const newCount = premiumGenerationCount + 1;
      try {
        localStorage.setItem(PREMIUM_AI_GENERATIONS_KEY, JSON.stringify({
          count: newCount,
          date: new Date().toDateString()
        }));
      } catch (e) {
        // ignore
      }
      setPremiumGenerationCount(newCount);
      return newCount;
    } else {
      const newCount = generationCount + 1;
      try {
        localStorage.setItem(AI_GENERATIONS_KEY, JSON.stringify({
          count: newCount,
          date: new Date().toDateString()
        }));
      } catch (e) {
        // ignore
      }
      setGenerationCount(newCount);
      return newCount;
    }
  }, [generationCount, premiumGenerationCount, isPremium]);

  const canGenerate = isPremium
    ? premiumGenerationCount < PREMIUM_LIMIT
    : generationCount < FREE_LIMIT;

  const remainingGenerations = isPremium
    ? Math.max(0, PREMIUM_LIMIT - premiumGenerationCount)
    : Math.max(0, FREE_LIMIT - generationCount);

  return {
    generationCount: isPremium ? premiumGenerationCount : generationCount,
    incrementGeneration,
    canGenerate,
    remainingGenerations,
    freeLimit: FREE_LIMIT,
    premiumLimit: PREMIUM_LIMIT
  };
};
