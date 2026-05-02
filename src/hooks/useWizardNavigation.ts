import { useCallback, useRef, useState } from 'react'

export type AnimationDirection = 'left' | 'right'

export interface UseWizardNavigationReturn {
  /** Current step number (0-6) */
  step: number
  /** Animation direction for step transitions */
  animDir: AnimationDirection
  /** Navigate to a specific step */
  goToStep: (newStep: number) => void
  /** Go to next step */
  nextStep: () => void
  /** Go to previous step */
  prevStep: () => void
  /** Manually set step (use goToStep for navigation with animation) */
  setStep: (step: number) => void
}

/**
 * Wizard navigation hook
 * Manages step state, navigation, and animation direction
 *
 * Note: the product now uses the `/builder` flow as the primary experience.
 * To avoid "two different flows" depending on prior sessions, wizard step
 * state is no longer persisted/restored from localStorage.
 *
 * @returns Navigation state and handlers
 */
export const useWizardNavigation = (): UseWizardNavigationReturn => {
  const [step, setStep] = useState<number>(0)
  const [animDir, setAnimDir] = useState<AnimationDirection>('left')
  const prevStepRef = useRef<number>(step)

  /**
   * Navigate to a specific step with animation
   * Scrolls to top of page
   */
  const goToStep = useCallback((newStep: number) => {
    setAnimDir(newStep > prevStepRef.current ? 'right' : 'left')
    prevStepRef.current = newStep
    setStep(newStep)
    // Scroll to top so the next step is visible from the start
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /** Navigate to next step */
  const nextStep = useCallback(() => {
    goToStep(step + 1)
  }, [step, goToStep])

  /** Navigate to previous step */
  const prevStep = useCallback(() => {
    goToStep(step - 1)
  }, [step, goToStep])

  return {
    step,
    animDir,
    goToStep,
    nextStep,
    prevStep,
    setStep,
  }
}
