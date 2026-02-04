import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TEMPLATE_OPTIONS, TRANSLATIONS, INITIAL_DATA, PREMIUM_PRICE_CHF } from '../constants';
import { validateSwissPhone, validateSwissPostal, validateEmail } from '../utils/swissValidation';

const PREMIUM_STORAGE_KEY = 'pet-bewerbung-premium';
const AI_GENERATIONS_KEY = 'pet-bewerbung-ai-generations';

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
        dataToSave.photoPreview = '';
        dataToSave.hasPhotoSaved = false;
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
 * Premium state management hook
 * Handles premium status with localStorage persistence and restoration via token
 * @returns {Object} - Premium state and handlers
 */
export const usePremium = () => {
  const [isPremium, setIsPremiumState] = useState(() => {
    try {
      const saved = localStorage.getItem(PREMIUM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if premium hasn't expired (optional: add expiry logic if needed)
        return parsed.active === true;
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Could not load premium status:', e);
      }
    }
    return false;
  });
  
  const [restoreStatus, setRestoreStatus] = useState(null); // 'loading', 'success', 'error', null

  // Check URL for premium restoration token on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restoreToken = params.get('restore');
    
    if (restoreToken) {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Verify token with server
      verifyAndRestorePremium(restoreToken);
    }
  }, []);
  
  // Verify restore token with server
  const verifyAndRestorePremium = async (token) => {
    setRestoreStatus('loading');
    try {
      const response = await fetch(`/api/verify-restore/${token}`);
      const data = await response.json();
      
      if (data.valid) {
        activatePremium(data.sessionId);
        setRestoreStatus('success');
      } else {
        setRestoreStatus('error');
        if (import.meta.env.DEV) {
          console.warn('Premium restore failed:', data.error);
        }
      }
    } catch (e) {
      setRestoreStatus('error');
      if (import.meta.env.DEV) {
        console.warn('Premium restore error:', e);
      }
    }
  };

  // Save premium status to localStorage
  const activatePremium = useCallback((paymentId = null) => {
    const premiumData = {
      active: true,
      activatedAt: new Date().toISOString(),
      paymentId: paymentId
    };
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(premiumData));
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Could not save premium status:', e);
      }
    }
    setIsPremiumState(true);
  }, []);

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
    activatePremium,
    isTemplateAccessible,
    getTemplateInfo,
    premiumPrice: PREMIUM_PRICE_CHF,
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

  // Save generation count
  const incrementGeneration = useCallback(() => {
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
  }, [generationCount]);

  const canGenerate = isPremium || generationCount < FREE_LIMIT;
  const remainingGenerations = isPremium ? Infinity : Math.max(0, FREE_LIMIT - generationCount);

  return {
    generationCount,
    incrementGeneration,
    canGenerate,
    remainingGenerations,
    freeLimit: FREE_LIMIT
  };
};
