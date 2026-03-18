import React, { useEffect, useRef } from 'react';

function throttleRAF(fn) {
  let rafId = null;
  let lastArgs = null;
  const tick = () => {
    rafId = null;
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };
  return (...args) => {
    lastArgs = args;
    if (rafId == null) rafId = requestAnimationFrame(tick);
  };
}

const Parallax = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cache DOM elements - querySelectorAll on every mousemove causes Layout Thrashing
    const speedElements = Array.from(el.querySelectorAll('[data-speed]'));
    const scrollElements = Array.from(el.querySelectorAll('[data-scroll]'));

    let cachedRect = null;
    const updateRect = () => {
      cachedRect = el.getBoundingClientRect();
    };
    updateRect();

    const handleMove = (e) => {
      if (!cachedRect) return;
      const cx = cachedRect.left + cachedRect.width / 2;
      const cy = cachedRect.top + cachedRect.height / 2;
      const dx = (e.clientX - cx) / cachedRect.width;
      const dy = (e.clientY - cy) / cachedRect.height;
      speedElements.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0.02;
        const tx = dx * speed * 40;
        const ty = dy * speed * 40;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${tx * 0.02}deg)`;
      });
    };

    const handleScroll = () => {
      updateRect();
      const scrolled = window.scrollY;
      scrollElements.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-scroll')) || 0.2;
        layer.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
      });
    };

    const handleResize = () => updateRect();

    const throttledMove = throttleRAF(handleMove);
    const throttledScroll = throttleRAF(handleScroll);

    window.addEventListener('mousemove', throttledMove);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={ref} className="relative overflow-visible">{children}</div>;
};

export default Parallax;
