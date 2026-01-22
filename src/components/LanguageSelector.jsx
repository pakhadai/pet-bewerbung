import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { id: 'de', label: 'Deutsch', flag: 'de' },
  { id: 'fr', label: 'Français', flag: 'fr' },
  { id: 'it', label: 'Italiano', flag: 'it' },
  { id: 'rm', label: 'Rumantsch', flag: 'ch' },
  { id: 'en', label: 'English', flag: 'gb' },
  { id: 'ua', label: 'Українська', flag: 'ua' },
];

export default function LanguageSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.id === value) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langId) => {
    onChange(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg theme-card theme-border border hover:theme-card-bg-hover hover:shadow-md"
        style={{ 
          transition: 'transform 500ms ease-in-out',
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select language. Current: ${currentLang.label}`}
      >
        <img
          src={`https://flagcdn.com/24x18/${currentLang.flag}.png`}
          alt=""
          width="24"
          height="18"
          className="shadow-sm"
          aria-hidden="true"
        />
        <span className="theme-text text-sm font-medium hidden sm:inline">{currentLang.label}</span>
        <ChevronDown
          size={16}
          className={`theme-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 theme-card border theme-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
          role="listbox"
          aria-label="Language selection"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              role="option"
              aria-selected={value === lang.id}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                value === lang.id
                  ? 'bg-primary text-white scale-[1.02]'
                  : 'theme-text hover:bg-primary/30 hover:text-primary hover:font-semibold'
              }`}
            >
              <img
                src={`https://flagcdn.com/24x18/${lang.flag}.png`}
                alt=""
                width="24"
                height="18"
                className="shadow-sm"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{lang.label}</span>
              {value === lang.id && (
                <svg
                  className="ml-auto"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
