import { useState, useEffect, useCallback } from 'react';
import type { TranslationObject } from '../types/template';

export const SUPPORTED_LANGS = ['de', 'fr', 'it', 'rm', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGS)[number];

/** First path segment for locale URLs: /de/, /fr/, … */
const PATH_LANG_RE = /^\/(de|fr|it|rm|en)(?:\/|$)/;

/**
 * Read active locale from the URL (SPA). Used for first paint + SEO routes.
 */
export const getLangFromPath = (): Language | null => {
  if (typeof window === 'undefined') return null;
  const m = window.location.pathname.match(PATH_LANG_RE);
  return m ? (m[1] as Language) : null;
};

/**
 * Detect user's language from browser settings
 */
const detectLang = (): Language => {
  try {
    const nav = (navigator && navigator.language ? navigator.language : '').slice(0, 2).toLowerCase();
    const found = SUPPORTED_LANGS.find((l) => l === nav);
    if (found) return found;
  } catch (e) {
    // ignore
  }
  return 'de';
};

const translationCache: Partial<Record<Language, TranslationObject>> = {};

// Vite glob import - enables code-splitting per language, avoids dynamic import path issues
const translationLoaders = import.meta.glob<{ default: TranslationObject }>('../translations/*.ts');

/**
 * Load translation for a language (lazy - only fetches when needed)
 */
const loadTranslation = async (lang: Language): Promise<TranslationObject> => {
  const cached = translationCache[lang];
  if (cached) return cached;
  const loader = translationLoaders[`../translations/${lang}.ts`];
  if (!loader) throw new Error(`No translation for ${lang}`);
  const module = await loader();
  translationCache[lang] = module.default;
  return translationCache[lang];
};

export interface UseTranslationReturn {
  /** Current translations object */
  t: TranslationObject;
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
  const [lang, setLangState] = useState<Language>(() => getLangFromPath() ?? detectLang());
  const [t, setT] = useState<TranslationObject>({});
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
    t,
    lang,
    setLang,
    isLoading,
  };
};
