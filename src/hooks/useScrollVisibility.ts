import { useState, useEffect, type RefObject } from 'react';

/**
 * Scroll visibility hook
 * Uses IntersectionObserver on a real DOM element (no document.body manipulation).
 * Caller must pass a ref attached to an element at the bottom of the scroll area.
 *
 * @param ref - Ref to the element to observe (e.g. a sentinel div at page bottom)
 * @param threshold - Distance from bottom in pixels for "near bottom" detection (default: 120)
 * @returns Whether the observed element is visible (or within threshold of viewport bottom)
 */
export const useScrollVisibility = (
  ref: RefObject<HTMLElement | null>,
  threshold: number = 120
): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        root: null,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
};
