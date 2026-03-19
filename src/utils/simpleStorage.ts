/**
 * Simple storage - PII in sessionStorage, photo in IndexedDB.
 * Replaces StorageManager/adapters. KISS.
 */

import { get, set, del } from 'idb-keyval';

const DRAFT_KEY = 'pet_cv_draft';
const PHOTO_KEY = 'pet_cv_photo';

export const simpleStorage = {
  saveDraft(data: Record<string, unknown>): void {
    try {
      const { photo, ...rest } = data;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...rest, updatedAt: Date.now() }));
    } catch (e) {
      console.error('[Storage] saveDraft failed', e);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storage-failed'));
      }
    }
  },

  loadDraft(): Record<string, unknown> | null {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async savePhoto(base64: string | null): Promise<void> {
    try {
      if (base64 && typeof base64 === 'string' && base64.length > 0) {
        await set(PHOTO_KEY, base64);
      } else {
        await del(PHOTO_KEY);
      }
    } catch (e) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storage-failed'));
      }
      throw e;
    }
  },

  async loadPhoto(): Promise<string | null> {
    try {
      return (await get(PHOTO_KEY)) ?? null;
    } catch {
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
      await del(PHOTO_KEY);
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[Storage] clearAll failed', e);
    }
  },
};
