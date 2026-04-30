/**
 * Per-locale SEO (title, description, Open Graph locale).
 * URLs: https://pet-bewerbung.ch/{de|fr|it|en|rm}/
 */
import type { Language } from '../hooks/useTranslation'

export const SITE_ORIGIN = 'https://pet-bewerbung.ch'

export interface SeoMeta {
  pageTitle: string
  pageDescription: string
  /** Open Graph locale, e.g. de_CH */
  ogLocale: string
}

export const SEO_META: Record<Language, SeoMeta> = {
  de: {
    pageTitle: 'Pet-Bewerbung | Professionelles Haustier-CV für die Wohnungsbewerbung (Schweiz)',
    pageDescription:
      'Kostenloses Pet-CV & Bewerbungsdossier für Hund, Katze und Haustier: Wohnungssuche Schweiz. Daten bleiben im Browser — kein Server.',
    ogLocale: 'de_CH',
  },
  fr: {
    pageTitle: 'Pet-Bewerbung | CV pour animal — dossier de candidature locative (Suisse)',
    pageDescription:
      'Créez un dossier professionnel pour votre animal (chien, chat) pour la recherche de logement en Suisse. Données traitées localement dans le navigateur.',
    ogLocale: 'fr_CH',
  },
  it: {
    pageTitle: 'Pet-Bewerbung | CV per animali domestici — domanda di affitto (Svizzera)',
    pageDescription:
      'Dossier gratuito per cane, gatto o altri animali: ricerca di un appartamento in Svizzera. I dati restano nel browser.',
    ogLocale: 'it_CH',
  },
  en: {
    pageTitle: 'Pet-Bewerbung | Pet CV & rental application dossier for Switzerland',
    pageDescription:
      'Free pet resume for renting with a dog or cat in Switzerland. Build a professional dossier — data stays in your browser, privacy-first.',
    ogLocale: 'en_CH',
  },
  rm: {
    pageTitle: 'Pet-Bewerbung | CV per animals — dossier per ina retschertga da chasa (Svizra)',
    pageDescription:
      'Dossier gratuit per chien, chat e pli: retschertga dad in apartmant en Svizra. Las datas restan en il navigatur.',
    ogLocale: 'rm_CH',
  },
}

/** hreflang → URL path segment (same as our Language codes) */
export const HREFLANG_LOCALES: Record<Language, string> = {
  de: 'de-CH',
  fr: 'fr-CH',
  it: 'it-CH',
  en: 'en-CH',
  rm: 'rm-CH',
}
