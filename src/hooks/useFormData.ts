import { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'pet-bewerbung-form-data';

/**
 * Load saved form data from localStorage
 * Merges with INITIAL_DATA to ensure all fields exist
 */
const loadSavedData = (defaultLang: string): any => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with INITIAL_DATA to ensure all fields exist
      return { ...INITIAL_DATA, ...parsed, lang: parsed.lang || defaultLang };
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Could not load saved form data:', e);
    }
  }
  return { ...INITIAL_DATA, lang: defaultLang };
};

/**
 * Save form data to localStorage
 * Handles large photos by not saving them
 */
const saveDataToStorage = (data: any): void => {
  try {
    const dataToSave = { ...data };

    // Don't save photo data to localStorage (too large)
    if (dataToSave.photoPreview && dataToSave.photoPreview.length > 50000) {
      // If photo is too large, store a flag instead
      console.warn('⚠️  Photo too large for localStorage (>50KB). Photo will not persist on page refresh.');
      dataToSave.photoPreview = '';
      dataToSave.hasPhotoSaved = false;
      // Flag to indicate photo was dropped (can be used to show warning in UI)
      dataToSave.photoTooLarge = true;
    } else {
      dataToSave.photoTooLarge = false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Could not save form data to localStorage:', e);
    }
  }
};

export interface UseFormDataReturn {
  /** Form data object */
  data: any;
  /** Update a single field */
  updateData: (field: string, value: any) => void;
  /** Update multiple fields at once */
  updateMultipleData: (updates: Record<string, any>) => void;
  /** Reset form to initial state (keeps language) */
  resetForm: () => void;
  /** Manually save current data to localStorage */
  saveData: () => void;
  /** Manually load data from localStorage */
  loadSavedData: () => void;
  /** Set entire data object (use with caution) */
  setData: (data: any) => void;
}

/**
 * Form data management hook
 * Manages form state with automatic localStorage persistence
 * Handles large photos by not persisting them
 *
 * @param defaultLang - Default language if none saved
 * @returns Form data state and handlers
 */
export const useFormData = (defaultLang: string = 'de'): UseFormDataReturn => {
  const [data, setData] = useState<any>(() => loadSavedData(defaultLang));
  const prevLangRef = useRef<string>(data.lang);

  // Save data to localStorage when it changes
  useEffect(() => {
    saveDataToStorage(data);
  }, [data]);

  // Clear generated text when language changes
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      setData((prev: any) => ({ ...prev, generatedText: '' }));
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText]);

  /**
   * Update a single field in form data
   */
  const updateData = useCallback((field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Update multiple fields at once
   */
  const updateMultipleData = useCallback((updates: Record<string, any>) => {
    setData((prev: any) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Reset form to initial state (preserves current language)
   */
  const resetForm = useCallback(() => {
    const currentLang = data.lang;
    const resetData = { ...INITIAL_DATA, lang: currentLang };
    setData(resetData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, [data.lang]);

  /**
   * Manually save current data to localStorage
   */
  const saveData = useCallback(() => {
    saveDataToStorage(data);
  }, [data]);

  /**
   * Manually reload data from localStorage
   */
  const loadData = useCallback(() => {
    const loaded = loadSavedData(defaultLang);
    setData(loaded);
  }, [defaultLang]);

  return {
    data,
    updateData,
    updateMultipleData,
    resetForm,
    saveData,
    loadSavedData: loadData,
    setData
  };
};
