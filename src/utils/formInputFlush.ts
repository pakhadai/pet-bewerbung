/**
 * Pending form values - written by FormInput on flush event.
 * Used by useFormData to merge unsaved debounced values before save on beforeunload.
 */
export const pendingFormValues: Record<string, string> = {};
export const FLUSH_EVENT = 'form-input-flush';

export const getPendingFormValues = (): Record<string, string> => ({ ...pendingFormValues });

export const clearPendingFormValues = (): void => {
  Object.keys(pendingFormValues).forEach((k) => delete pendingFormValues[k]);
};
