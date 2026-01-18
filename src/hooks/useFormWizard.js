import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TEMPLATE_OPTIONS, TRANSLATIONS, INITIAL_DATA } from '../constants';
import { validateSwissPhone, validateSwissPostal, validateEmail } from '../utils/swissValidation';

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
    console.warn('Could not load saved form data:', e);
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
      // Don't restore step 0 (landing) or steps after 8 (thank you)
      if (step >= 1 && step <= 8) {
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
      console.warn('Could not save form data to localStorage:', e);
    }
  }, [data]);

  // Save step to localStorage when it changes
  useEffect(() => {
    try {
      // Don't save step 0 (landing) or step 9 (thank you)
      if (step >= 1 && step <= 8) {
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

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    setToast(null);
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
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
      case 1: // Owner info
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
        break;

      case 2: // Pet info
        if (!data.name || data.name.trim().length < 1) {
          errors.name = true;
          isValid = false;
        }
        if (!data.petType) {
          errors.petType = true;
          isValid = false;
        }
        break;

      case 3: // Health & Insurance - optional fields, no validation needed
        break;

      case 4: // Description - optional
        break;

      case 5: // Photo - optional
        break;

      case 6: // Summary - no validation needed (review step)
        break;

      case 7: // Template selection - handled by template grid
        break;

      case 8: // Preview - no validation needed
        break;

      default:
        break;
    }

    return { errors, isValid };
  }, [data, step]);

  return validation;
};
