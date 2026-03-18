import { useState, useEffect } from 'react';

const DEVICE_ID_KEY = 'pet-bewerbung-device-id';

/**
 * Generate a crypto-safe UUID v4 device ID
 * SECURITY: Always generates UUID v4 format for high entropy
 */
const generateDeviceId = (): string => {
  try {
    // Try crypto.randomUUID first (modern browsers)
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    } else if (crypto && crypto.getRandomValues) {
      // Fallback: Manually generate UUID v4 using crypto.getRandomValues
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);

      // Set UUID v4 version bits (version 4)
      array[6] = (array[6] & 0x0f) | 0x40;
      // Set UUID variant bits (RFC 4122 variant)
      array[8] = (array[8] & 0x3f) | 0x80;

      // Format as UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    } else {
      // SECURITY: Fail instead of using weak Math.random
      throw new Error('Crypto API not available - cannot generate secure device ID');
    }
  } catch (e) {
    console.error('❌ CRITICAL: Device ID generation failed:', e);
    // Re-throw to prevent app from running with weak ID
    throw new Error('Failed to generate secure device ID. Please use a modern browser with crypto API support.');
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

  // Ensure device ID is always valid UUID v4 format
  useEffect(() => {
    // UUID v4 format validation regex
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!deviceId || !uuidV4Regex.test(deviceId)) {
      console.warn('⚠️  Invalid device ID detected, regenerating...');
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
