import { useMemo } from 'react'
import type { PetData } from '../types/form'
import { validateEmail, validateSwissPhone, validateSwissPostal } from '../utils/swissValidation'

const MIN_OWNER_NAME_LENGTH = 2
const MIN_PET_NAME_LENGTH = 2

export interface FormValidationErrors {
  [field: string]: boolean
}

export interface FormValidationResult {
  /** Validation errors by field name */
  errors: FormValidationErrors
  /** Whether form is valid for current step */
  isValid: boolean
}

/**
 * Pure validation function - call synchronously in event handlers (e.g. handleNext)
 * to avoid stale validation state from React batches.
 */
export function validateStep(data: PetData, step: number): FormValidationResult {
  const errors: FormValidationErrors = {}
  let isValid = true

  switch (step) {
    case 1:
      if (!data.ownerName || String(data.ownerName).trim().length < MIN_OWNER_NAME_LENGTH) {
        errors.ownerName = true
        isValid = false
      }
      if (data.email && !validateEmail(String(data.email))) {
        errors.email = true
        isValid = false
      }
      if (data.phone && !validateSwissPhone(String(data.phone))) {
        errors.phone = true
        isValid = false
      }
      if (data.postal && !validateSwissPostal(String(data.postal))) {
        errors.postal = true
        isValid = false
      }
      if (!data.name || String(data.name).trim().length < MIN_PET_NAME_LENGTH) {
        errors.name = true
        isValid = false
      }
      if (!data.petType) {
        errors.petType = true
        isValid = false
      }
      break
    case 2:
      // Emergency contacts optional
      break
    case 3:
      // Description: need generated text (from AI or manual)
      if (!data.generatedText?.trim()) {
        errors.generatedText = true
        isValid = false
      }
      break
    case 4:
      // Photo optional (PDF can render without)
      break
    case 5:
      // Template selection optional
      break
    default:
      break
  }

  return { errors, isValid }
}

/**
 * Form validation hook - use for UI (errors display).
 * For navigation handlers, use validateStep(data, step) synchronously.
 */
export const useFormValidation = (data: PetData, step: number): FormValidationResult => {
  return useMemo(() => validateStep(data, step), [data, step])
}
