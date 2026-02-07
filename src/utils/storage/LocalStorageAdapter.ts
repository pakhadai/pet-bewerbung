/**
 * LocalStorageAdapter - localStorage implementation of StorageAdapter
 * Provides synchronous localStorage access with async interface for consistency
 */

import type { StorageAdapter } from '../../types/storage';

export class LocalStorageAdapter implements StorageAdapter {
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
   * Get value from localStorage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const namespacedKey = this.getKey(key);
      const item = localStorage.getItem(namespacedKey);

      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error getting key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in localStorage
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const namespacedKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(namespacedKey, serialized);
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error setting key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Remove value from localStorage
   */
  async remove(key: string): Promise<void> {
    try {
      const namespacedKey = this.getKey(key);
      localStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error removing key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Clear all namespaced keys from localStorage
   */
  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.namespace}:`)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('[LocalStorageAdapter] Error clearing storage:', error);
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

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          // Remove namespace prefix
          keys.push(key.substring(prefix.length));
        }
      }

      return keys;
    } catch (error) {
      console.error('[LocalStorageAdapter] Error getting keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      const namespacedKey = this.getKey(key);
      return localStorage.getItem(namespacedKey) !== null;
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error checking key "${key}":`, error);
      return false;
    }
  }
}
