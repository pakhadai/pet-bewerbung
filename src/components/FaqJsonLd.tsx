import React, { useEffect } from 'react';
import type { TranslationObject } from '../types/template';

const SCRIPT_ID = 'app-faq-jsonld';

/**
 * Injects schema.org FAQPage JSON-LD (https://schema.org/FAQPage).
 *
 * Notes:
 * - Valid for any site; helps other parsers and documents intent.
 * - Google "FAQ" rich results in Search are often limited to authoritative
 *   health/government properties — a normal service site may not get the
 *   expanded FAQ snippet even with correct markup.
 * - Guidelines: Q/A in JSON-LD should match content users can see; FAQ in a
 *   modal-only UI is a grey area — for strongest SEO, expose the same Q&A on
 *   the page (e.g. landing section or /faq URL).
 */
export const FaqJsonLd: React.FC<{ t: TranslationObject }> = ({ t }) => {
  useEffect(() => {
    const items = t?.faq?.items;
    if (!items?.length) return;

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    const prev = document.getElementById(SCRIPT_ID);
    prev?.remove();

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, [t]);

  return null;
};

export default FaqJsonLd;
