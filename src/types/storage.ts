/**
 * Storage Types
 * Type definitions for storage abstraction layer
 */

export type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB';

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  has(key: string): Promise<boolean>;
}

export interface StorageOptions {
  adapter?: StorageType;
  namespace?: string;
  encryption?: boolean;
  compression?: boolean;
}

export interface StorageMetadata {
  createdAt: number;
  updatedAt: number;
  size: number;
  compressed: boolean;
  encrypted: boolean;
}

export interface StorageEntry<T> {
  data: T;
  metadata: StorageMetadata;
}

export type StorageKey =
  // Form Data
  | 'form-data'
  | 'form-step'
  | 'form-draft'

  // AI
  | 'ai-generations'
  | 'ai-last-reset'

  // UI State
  | 'theme-mode'
  | 'language'
  | 'cookies-accepted'

  // Templates
  | 'selected-template'
  | 'custom-design'

  // Photos (IndexedDB)
  | 'photo-blob'
  | 'photo-thumbnail'

  // Cache
  | 'csrf-token';

export interface StorageStrategy {
  maxSize: number; // bytes
  adapter: StorageType;
}

export const STORAGE_STRATEGIES: Record<StorageKey, StorageStrategy> = {
  // Small data → localStorage
  'form-step': { maxSize: 100, adapter: 'localStorage' },
  'theme-mode': { maxSize: 100, adapter: 'localStorage' },
  'language': { maxSize: 100, adapter: 'localStorage' },
  'selected-template': { maxSize: 100, adapter: 'localStorage' },
  'cookies-accepted': { maxSize: 100, adapter: 'localStorage' },

  // Medium data → localStorage
  'form-data': { maxSize: 10000, adapter: 'localStorage' },
  'custom-design': { maxSize: 5000, adapter: 'localStorage' },
  'ai-generations': { maxSize: 1000, adapter: 'localStorage' },
  'ai-last-reset': { maxSize: 100, adapter: 'localStorage' },

  // Temporary data → sessionStorage (cleared when tab closes)
  'form-draft': { maxSize: 10000, adapter: 'sessionStorage' },
  'csrf-token': { maxSize: 200, adapter: 'sessionStorage' },

  // Large data → IndexedDB
  'photo-blob': { maxSize: 10485760, adapter: 'indexedDB' }, // 10 MB
  'photo-thumbnail': { maxSize: 1048576, adapter: 'indexedDB' }, // 1 MB
};
