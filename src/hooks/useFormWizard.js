import { useState, useEffect, useRef, useCallback } from 'react';
import { TEMPLATE_OPTIONS, TRANSLATIONS, INITIAL_DATA } from '../constants';

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

export const useFormWizard = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => ({ ...INITIAL_DATA, lang: detectLang() }));
  const [animDir, setAnimDir] = useState('left');
  const prevStepRef = useRef(0);

  // Translations
  const t = TRANSLATIONS[data.lang] || TRANSLATIONS.de;

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
    prevStep
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
