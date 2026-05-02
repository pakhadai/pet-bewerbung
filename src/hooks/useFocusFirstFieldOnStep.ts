import { useEffect } from 'react'

export const useFocusFirstFieldOnStep = (step: number): void => {
  useEffect(() => {
    if (step < 1 || step > 6) return
    const id = window.setTimeout(() => {
      const firstInput = document.querySelector<HTMLElement>(
        'main input:not([type="hidden"]), main select, main textarea'
      )
      firstInput?.focus({ preventScroll: false })
    }, 100)
    return () => window.clearTimeout(id)
  }, [step])
}

