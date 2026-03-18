import { useState, useEffect, useCallback } from 'react';

const SUPPORTED_LANGS = ['de', 'fr', 'it', 'rm', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGS)[number];

/**
 * Detect user's language from browser settings
 */
const detectLang = (): string => {
  try {
    const nav = (navigator && (navigator.language || (navigator as any).userLanguage) || '').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(nav as Language)) return nav;
  } catch (e) {
    // ignore
  }
  return 'de';
};

const translationCache: Record<string, any> = {};

// Vite glob import - enables code-splitting per language, avoids dynamic import path issues
const translationLoaders = import.meta.glob<{ default: any }>('../translations/*.js');

/**
 * Load translation for a language (lazy - only fetches when needed)
 */
const loadTranslation = async (lang: Language): Promise<any> => {
  if (translationCache[lang]) return translationCache[lang];
  const loader = translationLoaders[`../translations/${lang}.js`];
  if (!loader) throw new Error(`No translation for ${lang}`);
  const module = await loader();
  translationCache[lang] = module.default;
  return translationCache[lang];
};

export interface UseTranslationReturn {
  /** Current translations object */
  t: any;
  /** Current language code */
  lang: Language;
  /** Set language */
  setLang: (lang: Language) => void;
  /** Loading state (true until first translation loads) */
  isLoading: boolean;
}

/**
 * Translation hook - lazy loads translations to reduce initial bundle
 * @returns Translation state and handlers
 */
export const useTranslation = (): UseTranslationReturn => {
  const [lang, setLangState] = useState<Language>(() => detectLang() as Language);
  const [t, setT] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadTranslation(lang).then((tr) => {
      if (!cancelled) {
        setT(tr);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  return {
    t: t ?? {},
    lang,
    setLang,
    isLoading,
  };
};
