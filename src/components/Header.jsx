import React from 'react';
import { PawPrint } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const Header = ({ step, theme, onThemeChange, lang, onLangChange, onLogoClick, t }) => {
  const showStepTitle = step > 0 && step < 9;

  return (
    <header className="app-header sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all">
      <div className="flex items-center gap-3 font-bold text-lg cursor-pointer" onClick={onLogoClick}>
        <div className="theme-button-primary p-1.5 rounded-lg shadow-md">
          <PawPrint size={18} />
        </div>
        <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
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
