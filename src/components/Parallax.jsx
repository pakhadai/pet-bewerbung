import React, { useEffect, useRef } from 'react';

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

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div ref={ref} className="relative overflow-visible">{children}</div>;
};

export default Parallax;
