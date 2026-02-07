import { useState, useEffect, useRef, useCallback } from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface Toast {
  /** Toast message */
  msg: string;
  /** Toast type (determines styling) */
  type: ToastType;
}

export interface UseToastReturn {
  /** Current toast (null if no toast) */
  toast: Toast | null;
  /** Show a toast message */
  showToast: (msg: string, type?: ToastType) => void;
  /** Hide the current toast */
  hideToast: () => void;
}

/**
 * Toast notification hook
 * Manages temporary notification messages with auto-dismiss
 *
 * @param duration - Toast duration in milliseconds (default: 5000ms)
 * @returns Toast state and handlers
 */
export const useToast = (duration: number = 5000): UseToastReturn => {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Show a toast message
   * Clears any existing toast and sets a new auto-dismiss timer
   */
  const showToast = useCallback((msg: string, type: ToastType = 'info') => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ msg, type });
    timeoutRef.current = setTimeout(() => setToast(null), duration);
  }, [duration]);

  /**
   * Manually hide the current toast
   */
  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { toast, showToast, hideToast };
};
