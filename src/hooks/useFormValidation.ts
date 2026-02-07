import { useMemo } from 'react';
import { validateSwissPhone, validateSwissPostal, validateEmail } from '../utils/swissValidation';

export interface FormValidationErrors {
  [field: string]: boolean;
}

export interface FormValidationResult {
  /** Validation errors by field name */
  errors: FormValidationErrors;
  /** Whether form is valid for current step */
  isValid: boolean;
}

/**
 * Form validation hook
 * Validates form data for each step
 *
 * @param data - Form data object
 * @param step - Current step number
 * @returns Validation state with errors and isValid flag
 */
export const useFormValidation = (data: any, step: number): FormValidationResult => {
  const validation = useMemo(() => {
    const errors: FormValidationErrors = {};
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
