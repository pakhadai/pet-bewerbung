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

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.querySelectorAll('[data-speed]').forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0.02;
        const tx = dx * speed * 40;
        const ty = dy * speed * 40;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${tx * 0.02}deg)`;
      });
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      el.querySelectorAll('[data-scroll]').forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-scroll')) || 0.2;
        layer.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
      });
    };

    const throttledMove = throttleRAF(handleMove);
    const throttledScroll = throttleRAF(handleScroll);

    window.addEventListener('mousemove', throttledMove);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return <div ref={ref} className="relative overflow-visible">{children}</div>;
};

export default Parallax;
