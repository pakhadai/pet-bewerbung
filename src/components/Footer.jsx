import React, { useState, useEffect, useRef } from 'react';
import { LegalFooterLinks } from './LegalPages';

const Footer = ({ step, t, onOpenLegal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if at the bottom (within 100px)
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 100;
      
      // Check scroll direction
      const isScrollingDown = currentScrollY > lastScrollY.current;
      
      // Show only when at bottom AND scrolling down (or at very bottom)
      if (isAtBottom && isScrollingDown) {
        setIsVisible(true);
      } else if (!isAtBottom || !isScrollingDown) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show footer on step 0 (landing) and step 9 (thank you)
  if (step !== 0 && step !== 9) {
    return null;
  }

  return (
    <footer 
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-out print:hidden ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}
    >
      <div className="theme-card border-t theme-border backdrop-blur-md bg-opacity-90 py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center text-sm theme-text-muted">
            <img
              src="https://flagcdn.com/20x15/ch.png"
              alt="CH"
              width="20"
              height="15"
              className="mr-2"
            />
            <span>Made with ❤️ in Switzerland</span>
          </div>
          <LegalFooterLinks t={t} onOpenLegal={onOpenLegal} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
