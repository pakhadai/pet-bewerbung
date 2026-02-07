import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_STEP_KEY = 'pet-bewerbung-step';

/**
 * Load saved step from localStorage
 * Don't restore step 0 (landing) or step 6 (thank you)
 */
const loadSavedStep = (): number => {
  try {
    const saved = localStorage.getItem(STORAGE_STEP_KEY);
    if (saved) {
      const step = parseInt(saved, 10);
      // Only restore steps 1-5
      if (step >= 1 && step <= 5) {
        return step;
      }
    }
  } catch (e) {
    // ignore
  }
  return 0;
};

export type AnimationDirection = 'left' | 'right';

export interface UseWizardNavigationReturn {
  /** Current step number (0-6) */
  step: number;
  /** Animation direction for step transitions */
  animDir: AnimationDirection;
  /** Navigate to a specific step */
  goToStep: (newStep: number) => void;
  /** Go to next step */
  nextStep: () => void;
  /** Go to previous step */
  prevStep: () => void;
  /** Manually set step (use goToStep for navigation with animation) */
  setStep: (step: number) => void;
}

/**
 * Wizard navigation hook
 * Manages step state, navigation, and animation direction
 * Persists step to localStorage (only steps 1-5)
 *
 * @returns Navigation state and handlers
 */
export const useWizardNavigation = (): UseWizardNavigationReturn => {
  const [step, setStep] = useState<number>(() => loadSavedStep());
  const [animDir, setAnimDir] = useState<AnimationDirection>('left');
  const prevStepRef = useRef<number>(step);

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

  /**
   * Navigate to a specific step with animation
   * Scrolls to top of page
   */
  const goToStep = useCallback((newStep: number) => {
    setAnimDir(newStep > prevStepRef.current ? 'right' : 'left');
    prevStepRef.current = newStep;
    setStep(newStep);
    // Scroll to top so the next step is visible from the start
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Navigate to next step */
  const nextStep = useCallback(() => {
    goToStep(step + 1);
  }, [step, goToStep]);

  /** Navigate to previous step */
  const prevStep = useCallback(() => {
    goToStep(step - 1);
  }, [step, goToStep]);

  return {
    step,
    animDir,
    goToStep,
    nextStep,
    prevStep,
    setStep
  };
};
