/**
 * Form store - Zustand with atomic subscriptions.
 * Replaces Context-based form state. Components re-render only when their selected slice changes.
 */

import { create } from 'zustand';
import { INITIAL_DATA } from '../constants';
import { simpleStorage } from '../utils/simpleStorage';

const SAVE_DEBOUNCE_MS = 500;
export const STORAGE_FAILED_EVENT = 'storage-failed';

type FormData = Record<string, unknown>;

interface FormState {
  data: FormData;
  isLoading: boolean;
  prevPhoto: string | null | undefined;
  updateData: (field: string, value: unknown) => void;
  updateMultipleData: (updates: Record<string, unknown>) => void;
  setData: (data: FormData) => void;
  resetForm: () => Promise<void>;
  loadDraft: (defaultLang: string) => Promise<void>;
  saveData: () => Promise<void>;
}

let saveTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isSavingRef = false;

const saveDraftSync = (data: FormData): void => {
  try {
    const { photo, hasPhotoSaved, ...rest } = data;
    simpleStorage.saveDraft({ ...rest, updatedAt: Date.now() });
  } catch {
    /* ignore */
  }
};

const saveDraftAsync = async (
  data: FormData,
  prevPhoto: string | null | undefined
): Promise<void> => {
  const currentPhoto = data.photo as string | null | undefined;
  if (currentPhoto !== prevPhoto) {
    await simpleStorage.savePhoto(
      currentPhoto && typeof currentPhoto === 'string' ? currentPhoto : null
    );
  }
  const { photo, ...rest } = data;
  simpleStorage.saveDraft({ ...rest, hasPhotoSaved: !!currentPhoto });
};

export const useFormStore = create<FormState>((set, get) => ({
  data: { ...INITIAL_DATA, lang: 'de' },
  isLoading: true,
  prevPhoto: undefined,

  updateData: (field, value) => {
    set((state) => ({
      data: { ...state.data, [field]: value },
    }));
    scheduleSave(get);
  },

  updateMultipleData: (updates) => {
    set((state) => ({
      data: { ...state.data, ...updates },
    }));
    scheduleSave(get);
  },

  setData: (data) => {
    set({ data });
    scheduleSave(get);
  },

  resetForm: async () => {
    const { data } = get();
    const currentLang = (data.lang as string) || 'de';
    const resetData = { ...INITIAL_DATA, lang: currentLang };
    set({ data: resetData, prevPhoto: null });
    await simpleStorage.clearAll();
  },

  loadDraft: async (defaultLang) => {
    set({ isLoading: true });
    try {
      const saved = simpleStorage.loadDraft();
      const photo = await simpleStorage.loadPhoto();
      const merged: FormData = saved
        ? {
            ...INITIAL_DATA,
            ...saved,
            lang: (saved.lang as string) || defaultLang,
          }
        : { ...INITIAL_DATA, lang: defaultLang };
      delete merged.hasPhotoSaved;
      merged.photo = photo;
      merged.hasPhotoSaved = !!photo;
      set({ data: merged, isLoading: false, prevPhoto: photo });
    } catch (e) {
      if (import.meta.env.DEV) console.warn('loadDraft failed', e);
      set({ data: { ...INITIAL_DATA, lang: defaultLang }, isLoading: false, prevPhoto: undefined });
    }
  },

  saveData: async () => {
    const { data, prevPhoto } = get();
    isSavingRef = true;
    try {
      await saveDraftAsync(data, prevPhoto);
      set({ prevPhoto: data.photo as string | null });
    } catch (err) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STORAGE_FAILED_EVENT));
      }
      throw err;
    } finally {
      isSavingRef = false;
    }
  },
}));

function scheduleSave(get: () => FormState) {
  if (saveTimeoutId) clearTimeout(saveTimeoutId);
  saveTimeoutId = setTimeout(async () => {
    saveTimeoutId = null;
    const { data, prevPhoto } = get();
    isSavingRef = true;
    try {
      await saveDraftAsync(data, prevPhoto);
      useFormStore.setState({ prevPhoto: data.photo as string | null });
    } catch (err) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STORAGE_FAILED_EVENT));
      }
      console.error('Auto-save failed', err);
    } finally {
      isSavingRef = false;
    }
  }, SAVE_DEBOUNCE_MS);
}

/** Sync save for beforeunload / emergency-flush. Call from effects. */
export const flushFormStoreSync = (): void => {
  const { data } = useFormStore.getState();
  saveDraftSync(data);
};

/** Check if save is in progress or pending (for beforeunload block) */
export const isFormStoreSaving = (): boolean => isSavingRef || saveTimeoutId !== null;
