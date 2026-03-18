/**
 * StorageManager - Unified storage abstraction layer
 * Automatically selects the appropriate storage adapter based on data size and strategy
 * Graceful degradation: IndexedDB unavailable in private mode -> fallback to localStorage
 */

import type {
  StorageAdapter,
  StorageKey,
  StorageOptions,
  StorageType,
} from '../../types/storage';
import { STORAGE_STRATEGIES } from '../../types/storage';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { SessionStorageAdapter } from './SessionStorageAdapter';
import { IndexedDBAdapter } from './IndexedDBAdapter';

const isIndexedDBAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && window.indexedDB != null;
  } catch {
    return false;
  }
};

export class StorageManager {
  private adapters: Map<StorageType, StorageAdapter>;
  private namespace: string;

  constructor(namespace: string = 'pet-cv') {
    this.namespace = namespace;
    this.adapters = new Map();

    this.adapters.set('localStorage', new LocalStorageAdapter(namespace));
    this.adapters.set('sessionStorage', new SessionStorageAdapter(namespace));
    this.adapters.set(
      'indexedDB',
      isIndexedDBAvailable() ? new IndexedDBAdapter(namespace) : new LocalStorageAdapter(namespace)
    );
  }

  /**
   * Get the appropriate adapter for a storage key
   */
  private getAdapterForKey(key: StorageKey, options?: StorageOptions): StorageAdapter {
    // Use explicit adapter from options if provided
    if (options?.adapter) {
      const adapter = this.adapters.get(options.adapter);
      if (!adapter) {
        throw new Error(`Unknown storage adapter: ${options.adapter}`);
      }
      return adapter;
    }

    // Use strategy from STORAGE_STRATEGIES
    const strategy = STORAGE_STRATEGIES[key];
    if (!strategy) {
      // Default to localStorage for unknown keys
      console.warn(`[StorageManager] No strategy found for key "${key}", using localStorage`);
      return this.adapters.get('localStorage')!;
    }

    const adapter = this.adapters.get(strategy.adapter);
    if (!adapter) {
      throw new Error(`Unknown storage adapter: ${strategy.adapter}`);
    }

    return adapter;
  }

  /**
   * Get value from storage
   */
  async get<T>(key: StorageKey, options?: StorageOptions): Promise<T | null> {
    try {
      const adapter = this.getAdapterForKey(key, options);
      return await adapter.get<T>(key);
    } catch (error) {
      console.error(`[StorageManager] Error getting key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in storage
   */
  async set<T>(key: StorageKey, value: T, options?: StorageOptions): Promise<void> {
    try {
      const adapter = this.getAdapterForKey(key, options);
      await adapter.set<T>(key, value);
    } catch (error) {
      console.error(`[StorageManager] Error setting key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Remove value from storage
   */
  async remove(key: StorageKey, options?: StorageOptions): Promise<void> {
    try {
      const adapter = this.getAdapterForKey(key, options);
      await adapter.remove(key);
    } catch (error) {
      console.error(`[StorageManager] Error removing key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Check if key exists in storage
   */
  async has(key: StorageKey, options?: StorageOptions): Promise<boolean> {
    try {
      const adapter = this.getAdapterForKey(key, options);
      return await adapter.has(key);
    } catch (error) {
      console.error(`[StorageManager] Error checking key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all storage (all adapters)
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.adapters.get('localStorage')!.clear(),
        this.adapters.get('sessionStorage')!.clear(),
        this.adapters.get('indexedDB')!.clear(),
      ]);
    } catch (error) {
      console.error('[StorageManager] Error clearing all storage:', error);
      throw error;
    }
  }

  /**
   * Clear specific adapter
   */
  async clear(adapterType: StorageType): Promise<void> {
    try {
      const adapter = this.adapters.get(adapterType);
      if (!adapter) {
        throw new Error(`Unknown storage adapter: ${adapterType}`);
      }
      await adapter.clear();
    } catch (error) {
      console.error(`[StorageManager] Error clearing ${adapterType}:`, error);
      throw error;
    }
  }

  /**
   * Get all keys from all adapters
   */
  async getAllKeys(): Promise<{ [key in StorageType]: string[] }> {
    try {
      const [localKeys, sessionKeys, indexedDBKeys] = await Promise.all([
        this.adapters.get('localStorage')!.keys(),
        this.adapters.get('sessionStorage')!.keys(),
        this.adapters.get('indexedDB')!.keys(),
      ]);

      return {
        localStorage: localKeys,
        sessionStorage: sessionKeys,
        indexedDB: indexedDBKeys,
      };
    } catch (error) {
      console.error('[StorageManager] Error getting all keys:', error);
      return {
        localStorage: [],
        sessionStorage: [],
        indexedDB: [],
      };
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    localStorage: number;
    sessionStorage: number;
    indexedDB: number;
  }> {
    const keys = await this.getAllKeys();

    return {
      localStorage: keys.localStorage.length,
      sessionStorage: keys.sessionStorage.length,
      indexedDB: keys.indexedDB.length,
    };
  }
}

// Export singleton instance
export const storage = new StorageManager('pet-cv');
