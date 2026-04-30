/**
 * Simple storage - form draft in localStorage (survives tab close), photo in IndexedDB.
 * Migrates one-time from legacy sessionStorage.
 */

import { del, get, set } from 'idb-keyval'
import type { PetData } from '../types/form'

const DRAFT_KEY = 'pet_cv_draft'
/** Legacy key — migrated to localStorage on first read */
const LEGACY_SESSION_KEY = DRAFT_KEY
const PHOTO_KEY = 'pet_cv_photo'

function readLocalDraft(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY)
  } catch {
    return null
  }
}

function writeLocalDraft(json: string): void {
  localStorage.setItem(DRAFT_KEY, json)
}

/** One-time migration from sessionStorage → localStorage */
function migrateSessionToLocal(): void {
  try {
    if (readLocalDraft()) return
    const legacy = sessionStorage.getItem(LEGACY_SESSION_KEY)
    if (!legacy) return
    writeLocalDraft(legacy)
    sessionStorage.removeItem(LEGACY_SESSION_KEY)
  } catch {
    /* quota / private mode */
  }
}

export const simpleStorage = {
  saveDraft(data: Record<string, unknown>): void {
    try {
      const { photo, ...rest } = data
      writeLocalDraft(JSON.stringify({ ...rest, updatedAt: Date.now() }))
    } catch (e) {
      console.error('[Storage] saveDraft failed', e)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storage-failed'))
      }
    }
  },

  loadDraft(): Partial<PetData> | null {
    try {
      migrateSessionToLocal()
      const raw = readLocalDraft()
      return raw ? (JSON.parse(raw) as Partial<PetData>) : null
    } catch {
      return null
    }
  },

  async savePhoto(base64: string | null): Promise<void> {
    try {
      if (base64 && typeof base64 === 'string' && base64.length > 0) {
        await set(PHOTO_KEY, base64)
      } else {
        await del(PHOTO_KEY)
      }
    } catch (e) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storage-failed'))
      }
      throw e
    }
  },

  async loadPhoto(): Promise<string | null> {
    try {
      return (await get(PHOTO_KEY)) ?? null
    } catch {
      return null
    }
  },

  async clearAll(): Promise<void> {
    try {
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
      try {
        sessionStorage.removeItem(LEGACY_SESSION_KEY)
      } catch {
        /* ignore */
      }
      await del(PHOTO_KEY)
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[Storage] clearAll failed', e)
    }
  },
}
