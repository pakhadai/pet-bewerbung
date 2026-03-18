import { useState, useEffect, useRef } from 'react';

/**
 * Scroll visibility hook
 * Detects when user is near bottom of page
 * Uses requestAnimationFrame to throttle - max 1 state update per frame (avoids scroll thrashing)
 *
 * @param threshold - Distance from bottom in pixels (default: 120)
 * @returns Whether user is near bottom of page
 */
export const useScrollVisibility = (threshold: number = 120): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastValueRef = useRef<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const nearBottom =
          window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
        if (nearBottom !== lastValueRef.current) {
          lastValueRef.current = nearBottom;
          setIsVisible(nearBottom);
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [threshold]);

  return isVisible;
};
