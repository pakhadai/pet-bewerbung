import React from 'react';
import type { TranslationObject } from '../types/template';

interface LandingSeoSectionProps {
  darkMode: boolean;
  t: TranslationObject;
}

/**
 * Visible keyword-rich copy for crawlers and users (DE/FR/IT/EN/RM).
 */
const LandingSeoSection: React.FC<LandingSeoSectionProps> = ({ darkMode, t }) => {
  const hero = t.hero as Record<string, unknown> | undefined;
  const title = typeof hero?.seoSectionTitle === 'string' ? hero.seoSectionTitle : '';
  const paragraphs = Array.isArray(hero?.seoParagraphs) ? (hero.seoParagraphs as string[]) : [];
  if (!title || paragraphs.length === 0) return null;

  return (
    <section
      className={`w-full max-w-3xl text-left rounded-2xl border-2 p-6 sm:p-8 shadow-sm ${
        darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-white/80'
      }`}
      aria-labelledby="landing-seo-heading"
    >
      <h2
        id="landing-seo-heading"
        className={`font-display text-xl sm:text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-text-main'}`}
      >
        {title}
      </h2>
      <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
};

export default LandingSeoSection;
