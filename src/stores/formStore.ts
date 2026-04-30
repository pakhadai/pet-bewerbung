/**
 * Form store - Zustand with atomic subscriptions.
 * Replaces Context-based form state. Components re-render only when their selected slice changes.
 */

import { create } from 'zustand'
import { INITIAL_DATA } from '../constants'
import { SUPPORTED_LANGS } from '../hooks/useTranslation'
import type { Language, PetData } from '../types/form'
import { simpleStorage } from '../utils/simpleStorage'

const SAVE_DEBOUNCE_MS = 500
export const STORAGE_FAILED_EVENT = 'storage-failed'

interface FormState {
  data: PetData
  isLoading: boolean
  prevPhoto: string | null | undefined
  updateData: <K extends keyof PetData>(field: K, value: PetData[K]) => void
  updateMultipleData: (updates: Partial<PetData>) => void
  setData: (data: PetData) => void
  resetForm: () => Promise<void>
  loadDraft: (defaultLang: string) => Promise<void>
  saveData: () => Promise<void>
}

let saveTimeoutId: ReturnType<typeof setTimeout> | null = null
let isSavingRef = false

const saveDraftSync = (data: PetData): void => {
  try {
    const { photo: _photo, ...rest } = data
    simpleStorage.saveDraft({ ...rest, updatedAt: Date.now() })
  } catch {
    /* ignore */
  }
}

const saveDraftAsync = async (
  data: PetData,
  prevPhoto: string | null | undefined
): Promise<void> => {
  const currentPhoto = data.photo
  if (currentPhoto !== prevPhoto) {
    await simpleStorage.savePhoto(
      currentPhoto && typeof currentPhoto === 'string' ? currentPhoto : null
    )
  }
  const { photo, ...rest } = data
  simpleStorage.saveDraft({ ...rest, hasPhotoSaved: !!currentPhoto })
}

export const useFormStore = create<FormState>((set, get) => ({
  data: { ...INITIAL_DATA, lang: 'de' },
  isLoading: true,
  prevPhoto: undefined,

  updateData: (field, value) => {
    set((state) => ({
      data: { ...state.data, [field]: value },
    }))
    scheduleSave(get)
  },

  updateMultipleData: (updates) => {
    set((state) => ({
      data: { ...state.data, ...updates },
    }))
    scheduleSave(get)
  },

  setData: (data) => {
    set({ data })
    scheduleSave(get)
  },

  resetForm: async () => {
    const { data } = get()
    const currentLang = data.lang || 'de'
    const resetData = { ...INITIAL_DATA, lang: currentLang }
    set({ data: resetData, prevPhoto: null })
    await simpleStorage.clearAll()
  },

  loadDraft: async (defaultLang) => {
    set({ isLoading: true })

    // Isolate text and photo loading: a photo storage failure must NOT wipe text data.
    let saved: Partial<PetData> | null = null
    try {
      saved = simpleStorage.loadDraft()
    } catch (e) {
      if (import.meta.env.DEV) console.warn('loadDraft: failed to load text draft', e)
    }

    let photo = null
    try {
      photo = await simpleStorage.loadPhoto()
    } catch (e) {
      if (import.meta.env.DEV)
        console.warn('loadDraft: failed to load photo (text draft preserved)', e)
    }

    const rawLang = typeof saved?.lang === 'string' ? saved.lang : defaultLang
    const savedLang: Language = (SUPPORTED_LANGS as readonly string[]).includes(rawLang)
      ? (rawLang as Language)
      : 'de'
    const merged = saved
      ? { ...INITIAL_DATA, ...saved, lang: savedLang }
      : { ...INITIAL_DATA, lang: savedLang }
    const dataWithPhoto: PetData = { ...merged, photo, lang: savedLang }
    set({ data: dataWithPhoto, isLoading: false, prevPhoto: photo })
  },

  saveData: async () => {
    const { data, prevPhoto } = get()
    isSavingRef = true
    try {
      await saveDraftAsync(data, prevPhoto)
      set({ prevPhoto: data.photo })
    } catch (err) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STORAGE_FAILED_EVENT))
      }
      throw err
    } finally {
      isSavingRef = false
    }
  },
}))

function scheduleSave(get: () => FormState) {
  if (saveTimeoutId) clearTimeout(saveTimeoutId)
  saveTimeoutId = setTimeout(async () => {
    saveTimeoutId = null
    const { data, prevPhoto } = get()
    isSavingRef = true
    try {
      await saveDraftAsync(data, prevPhoto)
      useFormStore.setState({ prevPhoto: data.photo })
    } catch (err) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STORAGE_FAILED_EVENT))
      }
      console.error('Auto-save failed', err)
    } finally {
      isSavingRef = false
    }
  }, SAVE_DEBOUNCE_MS)
}

/** Sync save for beforeunload / emergency-flush. Call from effects. */
export const flushFormStoreSync = (): void => {
  const { data } = useFormStore.getState()
  saveDraftSync(data)
}

/** Check if save is in progress or pending (for beforeunload block) */
export const isFormStoreSaving = (): boolean => isSavingRef || saveTimeoutId !== null
