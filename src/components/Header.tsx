import React from 'react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: string;
  onLangChange: (lang: string) => void;
  onLogoClick: () => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, lang, onLangChange, onLogoClick, t }) => {
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ua', label: 'UA' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' },
    { code: 'it', label: 'IT' }
  ];

  return (
    <header className="w-full absolute top-0 z-50 px-4 py-4 lg:px-12 lg:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
          <div className={`flex size-10 items-center justify-center hand-drawn-border border-2 border-text-main rotate-[-3deg] transition-transform group-hover:rotate-0 overflow-hidden
            ${darkMode ? 'bg-gray-700' : 'bg-lavender'}`}>
            <img src="/logo.png" alt="pet-bewerbung.ch" className="w-full h-full object-contain" />
          </div>
          <h1 className={`text-3xl font-bold font-display tracking-wide transition-colors ${darkMode ? 'text-white' : 'text-text-main'}`}>
            {t?.header?.title || 'pet-bewerbung.ch'}
          </h1>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          
          {/* Language Switcher – font-display як на головній сторінці */}
          <div className={`hidden md:flex items-center gap-2 text-lg font-bold font-display ${darkMode ? 'text-gray-300' : 'text-text-main'}`}>
            {languages.map((lng, index) => (
              <React.Fragment key={lng.code}>
                {index > 0 && <span className="opacity-50">/</span>}
                <button 
                  type="button"
                  onClick={() => onLangChange(lng.code)}
                  className={`hover:text-primary transition-colors ${lang === lng.code ? 'border-b-2 border-primary' : 'opacity-70 hover:opacity-100'}`}
                >
                  {lng.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode" 
            className={`hidden md:flex items-center justify-center p-2 rounded-full transition-colors
               ${darkMode ? 'hover:bg-gray-700 text-yellow-300' : 'hover:bg-lavender text-text-main'}`}
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
