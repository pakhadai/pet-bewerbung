import React from 'react';

interface HeroProps {
  darkMode: boolean;
  t: any;
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ darkMode, t, onStartClick }) => {
  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl">
      
      {/* Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1 text-sm font-bold font-display uppercase tracking-widest hand-drawn-border border-2 border-text-main rotate-1 select-none
        ${darkMode ? 'bg-gray-800 text-primary-300' : 'bg-mint/50 text-primary-dark'}`}>
        <span className="size-2 rounded-full bg-primary-dark animate-pulse"></span>
        {t?.hero?.badge || '100% Free & No Signup'}
      </div>

      {/* Main Title */}
      <h2 className={`text-6xl sm:text-7xl lg:text-9xl font-bold font-display leading-none mt-2 transition-colors
         ${darkMode ? 'text-white' : 'text-text-main'}`}>
        {t?.hero?.title || 'Free Pet CV Creator'}
      </h2>

      {/* Privacy Shield */}
      <div className={`relative flex items-center gap-3 px-6 py-3 mt-4 border-2 border-text-main rounded-[25px_5px_25px_25px/25px_25px_5px_25px] transform -rotate-1 hover:rotate-0 transition-all duration-300 shadow-sm max-w-lg mx-auto group cursor-help
         ${darkMode ? 'bg-gray-800/80 border-gray-500' : 'bg-mint/40'}`}>
        <div className={`flex items-center justify-center size-10 rounded-full border-2 border-text-main shrink-0 group-hover:scale-110 transition-transform
           ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <span className="material-symbols-outlined text-2xl text-green-600 sketch-icon-filled">verified_user</span>
        </div>
        <div className="flex flex-col text-left">
          <span className={`font-display font-bold text-xl leading-none ${darkMode ? 'text-gray-200' : 'text-text-main'}`}>
            {t?.hero?.privacyTitle || 'Data Privacy Shield'}
          </span>
          <p className={`font-sans text-xs sm:text-sm font-bold leading-tight mt-0.5 ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
            {t?.hero?.privacyDesc || 'Your data is never stored. Everything happens in your browser.'}
          </p>
        </div>
      </div>

      {/* Subtitle */}
      <p className={`text-xl sm:text-2xl max-w-lg leading-relaxed font-medium italic mt-2 ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
        {t?.hero?.subtitle || 'Build a professional resume for your furry friend in minutes. Simple, fast, and completely private.'}
      </p>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
        <button 
          onClick={onStartClick}
          className={`group relative px-10 py-4 text-3xl font-bold font-display hand-drawn-button border-2 border-text-main transition-all hover:-translate-y-1 active:translate-y-0
           ${darkMode 
              ? 'bg-primary-dark text-white hover:bg-primary hover:text-gray-900' 
              : 'bg-lavender text-text-main hover:bg-primary'}`}>
          <span className="relative flex items-center justify-center gap-3">
            {t?.hero?.cta || 'Start Securely'}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock</span>
          </span>
          {/* Shadow element */}
          <div className={`absolute -bottom-1 -right-1 w-full h-full -z-10 rounded-xl border-2 border-transparent ${darkMode ? 'bg-white/10' : 'bg-primary/20'}`}></div>
        </button>
      </div>
    </div>
  );
};

export default Hero;
