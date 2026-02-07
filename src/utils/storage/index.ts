/**
 * Storage Module Exports
 * Provides unified storage abstraction layer
 */

export { LocalStorageAdapter } from './LocalStorageAdapter';
export { SessionStorageAdapter } from './SessionStorageAdapter';
export { IndexedDBAdapter } from './IndexedDBAdapter';
export { StorageManager, storage } from './StorageManager';

// Re-export storage types
export type {
  StorageType,
  StorageAdapter,
  StorageOptions,
  StorageKey,
} from '../../types/storage';
