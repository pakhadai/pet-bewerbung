import { useState, useCallback } from 'react';
import { TRANSLATIONS } from '../translations';

/**
 * Detect user's language from browser settings
 * Maps 'uk' to 'ua' for Ukrainian
 */
const detectLang = (): string => {
  try {
    const nav = (navigator && (navigator.language || (navigator as any).userLanguage) || '').slice(0, 2).toLowerCase();
    if (nav === 'uk') return 'ua';
    if (['de', 'fr', 'it', 'rm', 'en', 'ua'].includes(nav)) return nav;
  } catch (e) {
    // ignore
  }
  return 'de';
};

export type Language = 'de' | 'fr' | 'it' | 'rm' | 'en' | 'ua';

export interface UseTranslationReturn {
  /** Current translations object */
  t: any;
  /** Current language code */
  lang: Language;
  /** Set language */
  setLang: (lang: Language) => void;
}

/**
 * Translation hook
 * Manages current language and provides translation object
 * Auto-detects browser language on first load
 *
 * @returns Translation state and handlers
 */
export const useTranslation = (): UseTranslationReturn => {
  const [lang, setLangState] = useState<Language>(() => detectLang() as Language);

  // Get translations for current language with fallback to German
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  return {
    t,
    lang,
    setLang
  };
};
