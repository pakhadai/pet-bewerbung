import React from 'react';
import MaterialIcon from './MaterialIcon';
import { PUBLIC_LOGO_HEADER_PATH } from '../constants';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: string;
  onLangChange: (lang: string) => void;
  onLogoClick: () => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleDarkMode, 
  lang, 
  onLangChange, 
  onLogoClick, 
  t,
}) => {
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' },
    { code: 'it', label: 'IT' },
    { code: 'rm', label: 'RM' }
  ];

  return (
    <header className="w-full absolute top-0 z-50 px-4 py-4 lg:px-12 lg:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
          <div className={`flex size-10 items-center justify-center hand-drawn-border border-2 border-text-main rotate-[-3deg] transition-transform group-hover:rotate-0 overflow-hidden
            ${darkMode ? 'bg-gray-700' : 'bg-lavender'}`}>
            <img
              src={PUBLIC_LOGO_HEADER_PATH}
              alt="pet-bewerbung.ch"
              className="w-full h-full object-contain"
              width={40}
              height={40}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <h1 className={`text-3xl font-bold font-display tracking-wide transition-colors ${darkMode ? 'text-white' : 'text-text-main'}`}>
            {t?.header?.title || 'pet-bewerbung.ch'}
          </h1>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Mobile Language Switcher */}
          <div className="md:hidden">
            <label htmlFor="lang-mobile" className="sr-only">
              {t?.header?.language ?? 'Language'}
            </label>
            <select
              id="lang-mobile"
              value={lang}
              onChange={(e) => onLangChange(e.target.value)}
              className={`rounded-lg border px-2 py-1 text-sm font-display font-bold ${
                darkMode
                  ? 'bg-gray-800 text-gray-100 border-gray-600'
                  : 'bg-white text-text-main border-gray-300'
              }`}
              aria-label={t?.header?.language ?? 'Language'}
            >
              {languages.map((lng) => (
                <option key={lng.code} value={lng.code}>
                  {lng.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Language Switcher */}
          <div
            className={`hidden md:flex items-center gap-2 text-lg font-bold font-display ${
              darkMode ? 'text-gray-200' : 'text-text-main'
            }`}
          >
            {languages.map((lng, index) => (
              <React.Fragment key={lng.code}>
                {index > 0 && (
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'} aria-hidden>
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onLangChange(lng.code)}
                  className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
                    lang === lng.code
                      ? darkMode
                        ? 'border-b-2 border-primary text-white'
                        : 'border-b-2 border-primary text-text-main'
                      : darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-text-main'
                  }`}
                >
                  {lng.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Dark Mode Toggle — visible on mobile too (was hidden md:flex) */}
          <button 
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode" 
            className={`flex shrink-0 items-center justify-center p-2 rounded-full transition-colors
               ${darkMode ? 'hover:bg-gray-700 text-amber-200' : 'hover:bg-lavender text-text-main'}`}
          >
            <MaterialIcon name={darkMode ? 'light_mode' : 'dark_mode'} className="text-2xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
