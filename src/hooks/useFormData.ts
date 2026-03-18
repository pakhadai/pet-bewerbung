import { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_DATA } from '../constants';
import { storage } from '../utils/storage';

/**
 * Load saved form data from storage
 * Loads main form data from localStorage and photo from IndexedDB
 * Merges with INITIAL_DATA to ensure all fields exist
 */
const loadSavedData = async (defaultLang: string): Promise<any> => {
  try {
    // Load main form data from localStorage
    const saved = await storage.get<any>('form-data');

    // Load photo from IndexedDB (if exists)
    const photoBlob = await storage.get<string>('photo-blob');

    if (saved) {
      const mergedData = {
        ...INITIAL_DATA,
        ...saved,
        lang: saved.lang || defaultLang
      };

      // Restore photo from IndexedDB (stored under data.photo)
      if (photoBlob) {
        mergedData.photo = photoBlob;
        mergedData.hasPhotoSaved = true;
        mergedData.photoTooLarge = false;
      }

      return mergedData;
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Could not load saved form data:', e);
    }
  }

  return { ...INITIAL_DATA, lang: defaultLang };
};

/**
 * Save form data to storage
 * Saves main data to localStorage and photos to IndexedDB
 */
const saveDataToStorage = async (data: any): Promise<void> => {
  try {
    const dataToSave = { ...data };

    // Handle photo storage separately in IndexedDB (data.photo is the source)
    const photoData = dataToSave.photo;
    if (photoData && typeof photoData === 'string' && photoData.length > 0) {
      await storage.set('photo-blob', photoData);
      dataToSave.hasPhotoSaved = true;
      dataToSave.photoTooLarge = false;
      delete dataToSave.photo; // Don't store in localStorage (too large)
    } else {
      await storage.remove('photo-blob');
      dataToSave.hasPhotoSaved = false;
      delete dataToSave.photo;
    }

    // Save main form data to localStorage
    await storage.set('form-data', dataToSave);
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Could not save form data to storage:', e);
    }
    throw e;
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
  /** Manually save current data to storage */
  saveData: () => void;
  /** Manually load data from storage */
  loadSavedData: () => void;
  /** Set entire data object (use with caution) */
  setData: (data: any) => void;
  /** Loading state */
  isLoading: boolean;
}

/**
 * Form data management hook
 * Manages form state with automatic storage persistence
 * Uses IndexedDB for large photos and localStorage for form data
 *
 * @param defaultLang - Default language if none saved
 * @returns Form data state and handlers
 */
export const useFormData = (defaultLang: string = 'de'): UseFormDataReturn => {
  const [data, setData] = useState<any>({ ...INITIAL_DATA, lang: defaultLang });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const prevLangRef = useRef<string>(data.lang);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const loadedData = await loadSavedData(defaultLang);
      setData(loadedData);
      setIsLoading(false);
    };

    loadData();
  }, [defaultLang]);

  // Debounced save to storage when data changes
  useEffect(() => {
    if (isLoading) return; // Don't save while loading

    // Debounce save by 500ms to avoid excessive writes
    const timeoutId = setTimeout(() => {
      saveDataToStorage(data).catch(err => {
        console.error('Failed to save form data:', err);
      });
    }, 500);

    saveTimeoutRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId); // Use closure value, not ref
    };
  }, [data, isLoading]);

  // Track language changes (text is kept - user can regenerate if needed)
  useEffect(() => {
    prevLangRef.current = data.lang;
  }, [data.lang]);

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
  const resetForm = useCallback(async () => {
    const currentLang = data.lang;
    const resetData = { ...INITIAL_DATA, lang: currentLang };
    setData(resetData);

    try {
      // Clear all storage
      await storage.remove('form-data');
      await storage.remove('photo-blob');
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to clear storage during form reset:', e);
      }
    }
  }, [data.lang]);

  /**
   * Manually save current data to storage
   */
  const saveData = useCallback(() => {
    saveDataToStorage(data).catch(err => {
      console.error('Failed to save form data:', err);
    });
  }, [data]);

  /**
   * Manually reload data from storage
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const loaded = await loadSavedData(defaultLang);
    setData(loaded);
    setIsLoading(false);
  }, [defaultLang]);

  return {
    data,
    updateData,
    updateMultipleData,
    resetForm,
    saveData,
    loadSavedData: loadData,
    setData,
    isLoading
  };
};
