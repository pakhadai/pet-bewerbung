import { useState, useEffect, useRef } from 'react';

/**
 * Scroll visibility hook
 * Uses IntersectionObserver to avoid Layout Thrashing (offsetHeight/getBoundingClientRect in scroll handler).
 * Reading layout properties during scroll forces synchronous reflow 60x/sec on mobile.
 *
 * @param threshold - Distance from bottom in pixels (default: 120)
 * @returns Whether user is near bottom of page
 */
export const useScrollVisibility = (threshold: number = 120): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const spacer = document.createElement('div');
    spacer.setAttribute('aria-hidden', 'true');
    spacer.style.cssText = 'height:' + threshold + 'px;width:1px;pointer-events:none;';
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'height:1px;width:1px;';
    spacer.appendChild(sentinel);
    document.body.appendChild(spacer);
    sentinelRef.current = sentinel;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      spacer.remove();
      sentinelRef.current = null;
    };
  }, [threshold]);

  return isVisible;
};
