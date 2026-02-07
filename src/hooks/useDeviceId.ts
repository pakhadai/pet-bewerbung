import { useState, useEffect } from 'react';

const DEVICE_ID_KEY = 'pet-bewerbung-device-id';

/**
 * Generate a crypto-safe device ID
 * Falls back to less secure methods if crypto API unavailable
 */
const generateDeviceId = (): string => {
  try {
    // Try crypto.randomUUID first (modern browsers)
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    } else if (crypto && crypto.getRandomValues) {
      // Fallback to crypto.getRandomValues for better security
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return 'device-' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Last resort: Math.random (not cryptographically secure)
      console.warn('⚠️  Using weak random for device ID - crypto API not available');
      return 'device-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  } catch (e) {
    // If all fails, generate temporary ID (won't persist)
    console.error('Device ID generation failed:', e);
    return 'temp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
  }
};

/**
 * Get or create a stable device ID from localStorage
 */
const getDeviceIdFromStorage = (): string => {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (e) {
    console.error('Failed to access localStorage for device ID:', e);
    return generateDeviceId();
  }
};

export interface UseDeviceIdReturn {
  /** Unique device identifier */
  deviceId: string;
  /** Generate a new device ID */
  generateNewId: () => void;
}

/**
 * Device ID management hook
 * Generates and persists a stable device identifier for premium token binding
 *
 * @returns Device ID state and handlers
 */
export const useDeviceId = (): UseDeviceIdReturn => {
  const [deviceId, setDeviceId] = useState<string>(() => getDeviceIdFromStorage());

  // Ensure device ID is always valid
  useEffect(() => {
    if (!deviceId || deviceId.length < 10) {
      const newId = generateDeviceId();
      setDeviceId(newId);
      try {
        localStorage.setItem(DEVICE_ID_KEY, newId);
      } catch (e) {
        console.error('Failed to save device ID:', e);
      }
    }
  }, [deviceId]);

  const generateNewId = () => {
    const newId = generateDeviceId();
    setDeviceId(newId);
    try {
      localStorage.setItem(DEVICE_ID_KEY, newId);
    } catch (e) {
      console.error('Failed to save new device ID:', e);
    }
  };

  return {
    deviceId,
    generateNewId
  };
};
