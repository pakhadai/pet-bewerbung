import { useState, useEffect } from 'react';

/**
 * Scroll visibility hook
 * Detects when user is near bottom of page
 *
 * @param threshold - Distance from bottom in pixels (default: 120)
 * @returns Whether user is near bottom of page
 */
export const useScrollVisibility = (threshold: number = 120): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);
      setIsVisible(nearBottom);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return isVisible;
};
