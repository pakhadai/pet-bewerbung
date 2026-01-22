import React from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const Header = ({ step, theme, onThemeChange, lang, onLangChange, onLogoClick, t }) => {
  const showStepTitle = step > 0 && step < 9;

  return (
    <header className="app-header sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all">
      <div 
        className="flex items-center gap-3 font-bold text-lg cursor-pointer group transition-transform duration-500 ease-in-out hover:scale-[1.03]" 
        onClick={onLogoClick}
      >
        <div className="relative">
          <div className={`absolute inset-0 rounded-lg transition-all duration-500 ease-in-out ${
            theme === 'dark' 
              ? 'bg-white/20 group-hover:bg-white/30 blur-sm' 
              : theme === 'sepia'
              ? 'bg-amber-100/50 group-hover:bg-amber-100/70 blur-sm'
              : 'bg-gray-100/50 group-hover:bg-gray-100/70 blur-sm'
          }`}></div>
          <img 
            src="/logo.png" 
            alt="Pet-Bewerbung Logo" 
            className={`relative w-10 h-10 object-contain transition-transform duration-500 ease-in-out ${
              theme === 'dark' 
                ? 'drop-shadow-lg brightness-110 contrast-110' 
                : 'drop-shadow-md'
            }`}
            style={{ transform: 'scale(1)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        <span 
          className="hidden sm:inline theme-text transition-colors duration-500 ease-in-out"
          style={{ color: 'inherit' }}
          onMouseEnter={(e) => {
            const root = document.documentElement;
            const primary = getComputedStyle(root).getPropertyValue('--primary').trim() || '#4f46e5';
            e.currentTarget.style.color = primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
        >
          Pet-Bewerbung.ch
        </span>
      </div>

      {/* Step title in center - hide on step 9 (thank you page) */}
      {showStepTitle && (
        <div className="absolute left-1/2 transform -translate-x-1/2 theme-text font-semibold text-base hidden md:flex items-center gap-2">
          <span className="text-lg">
            {step === 1 ? '1️⃣' : step === 2 ? '2️⃣' : step === 3 ? '3️⃣' : step === 4 ? '4️⃣' : step === 5 ? '5️⃣' : step === 6 ? '6️⃣' : step === 7 ? '7️⃣' : '8️⃣'}
          </span>
          {t.stepTitles?.[step] || ''}
        </div>
      )}

      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        <LanguageSelector value={lang} onChange={onLangChange} />
      </div>
    </header>
  );
};

export default Header;
