/**
 * SessionStorageAdapter - sessionStorage implementation of StorageAdapter
 * Provides temporary storage that persists only for the browser session
 */

import type { StorageAdapter } from '../../types/storage';

export class SessionStorageAdapter implements StorageAdapter {
  private namespace: string;

  constructor(namespace: string = 'pet-cv') {
    this.namespace = namespace;
  }

  /**
   * Get namespaced key
   */
  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  /**
   * Get value from sessionStorage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const namespacedKey = this.getKey(key);
      const item = sessionStorage.getItem(namespacedKey);

      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[SessionStorageAdapter] Error getting key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in sessionStorage
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const namespacedKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(namespacedKey, serialized);
    } catch (error) {
      console.error(`[SessionStorageAdapter] Error setting key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Remove value from sessionStorage
   */
  async remove(key: string): Promise<void> {
    try {
      const namespacedKey = this.getKey(key);
      sessionStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`[SessionStorageAdapter] Error removing key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Clear all namespaced keys from sessionStorage
   */
  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(`${this.namespace}:`)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('[SessionStorageAdapter] Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all namespaced keys
   */
  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      const prefix = `${this.namespace}:`;

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(prefix)) {
          // Remove namespace prefix
          keys.push(key.substring(prefix.length));
        }
      }

      return keys;
    } catch (error) {
      console.error('[SessionStorageAdapter] Error getting keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      const namespacedKey = this.getKey(key);
      return sessionStorage.getItem(namespacedKey) !== null;
    } catch (error) {
      console.error(`[SessionStorageAdapter] Error checking key "${key}":`, error);
      return false;
    }
  }
}
