/**
 * HeroRoute Component
 * Landing page (step 0)
 * Shows hero section and feature overview
 */

import React from 'react';
import Hero from '../components/Hero';
import Steps from '../components/Steps';

interface HeroRouteProps {
  darkMode: boolean;
  t: any;
  onStartClick: () => void;
}

export const HeroRoute: React.FC<HeroRouteProps> = ({ darkMode, t, onStartClick }) => {
  return (
    <div className={`page page-enter-right reveal fade-enter flex flex-col items-center pt-28 pb-16 px-4 relative overflow-hidden`}>
      <div className={`absolute top-[15%] left-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}>
        <span className="material-symbols-outlined text-8xl rotate-12 select-none">pets</span>
      </div>
      <div className={`absolute bottom-[20%] right-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}>
        <span className="material-symbols-outlined text-9xl -rotate-12 select-none">favorite</span>
      </div>
      <div className="w-full max-w-6xl flex flex-col items-center text-center z-10 gap-16">
        <Hero darkMode={darkMode} t={t} onStartClick={onStartClick} />
        <Steps darkMode={darkMode} t={t} />
      </div>
    </div>
  );
};

export default HeroRoute;
