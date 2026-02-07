/**
 * IndexedDBAdapter - IndexedDB implementation of StorageAdapter
 * Provides async storage for large data (photos, blobs)
 */

import type { StorageAdapter } from '../../types/storage';

export class IndexedDBAdapter implements StorageAdapter {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(namespace: string = 'pet-cv', storeName: string = 'storage') {
    this.dbName = namespace;
    this.storeName = storeName;
  }

  /**
   * Initialize IndexedDB connection
   */
  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Get value from IndexedDB
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result ?? null);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get key "${key}": ${request.error}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDBAdapter] Error getting key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in IndexedDB
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to set key "${key}": ${request.error}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDBAdapter] Error setting key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Remove value from IndexedDB
   */
  async remove(key: string): Promise<void> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to remove key "${key}": ${request.error}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDBAdapter] Error removing key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Clear all keys from IndexedDB
   */
  async clear(): Promise<void> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to clear store: ${request.error}`));
        };
      });
    } catch (error) {
      console.error('[IndexedDBAdapter] Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys from IndexedDB
   */
  async keys(): Promise<string[]> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => {
          resolve(request.result.map(k => String(k)));
        };

        request.onerror = () => {
          reject(new Error(`Failed to get keys: ${request.error}`));
        };
      });
    } catch (error) {
      console.error('[IndexedDBAdapter] Error getting keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getKey(key);

        request.onsuccess = () => {
          resolve(request.result !== undefined);
        };

        request.onerror = () => {
          reject(new Error(`Failed to check key "${key}": ${request.error}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDBAdapter] Error checking key "${key}":`, error);
      return false;
    }
  }
}
