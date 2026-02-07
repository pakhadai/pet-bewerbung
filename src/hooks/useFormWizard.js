/**
 * Legacy useFormWizard.js export file
 * For backward compatibility with existing code
 *
 * This file re-exports the new TypeScript hooks and preserves legacy hooks
 * that were not split into separate files
 */

// Re-export main hook from TypeScript version
export { useFormWizard } from './useFormWizard.ts';

// Re-export individual hooks for those who import them directly
export { useWizardNavigation } from './useWizardNavigation.ts';
export { useFormData } from './useFormData.ts';
export { usePremiumSession as usePremium } from './usePremiumSession.ts';
export { useAIGeneration as useAIGenerations } from './useAIGeneration.ts';
export { useTranslation } from './useTranslation.ts';
export { useTheme } from './useTheme.ts';
export { useToast } from './useToast.ts';
export { useDeviceId } from './useDeviceId.ts';

// Legacy hooks that were not split (preserved from original file)
import { useState, useEffect, useMemo, useCallback } from 'react';
import { TEMPLATE_OPTIONS } from '../constants';
import { validateSwissPhone, validateSwissPostal, validateEmail } from '../utils/swissValidation';

/**
 * Template selection hook
 * Manages template preview and selection state
 */
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

/**
 * Payment flow hook
 * Manages donation and payment dialog state
 */
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

/**
 * Scroll visibility hook
 * Detects when user is near bottom of page
 */
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
