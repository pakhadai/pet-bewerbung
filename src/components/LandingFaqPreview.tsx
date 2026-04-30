import React from 'react'
import type { TranslationObject } from '../types/template'

interface LandingFaqPreviewProps {
  darkMode: boolean
  t: TranslationObject
  onOpenFullFaq: () => void
}

const PREVIEW_COUNT = 5

/**
 * Crawlable FAQ excerpt (same Q&A as modal) using native <details> for indexable HTML.
 */
const LandingFaqPreview: React.FC<LandingFaqPreviewProps> = ({ darkMode, t, onOpenFullFaq }) => {
  const items = t.faq?.items
  if (!items?.length) return null

  const preview = items.slice(0, PREVIEW_COUNT)
  const heroExtra = t.hero as { faqTeaserTitle?: string; faqTeaserCta?: string } | undefined
  const teaserTitle = heroExtra?.faqTeaserTitle ?? t.faq?.title ?? 'FAQ'
  const cta = heroExtra?.faqTeaserCta ?? 'FAQ'

  return (
    <section
      className={`w-full max-w-3xl text-left rounded-2xl border-2 p-6 sm:p-8 shadow-sm ${
        darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-white/80'
      }`}
      aria-labelledby="landing-faq-heading"
    >
      <h2
        id="landing-faq-heading"
        className={`font-display text-xl sm:text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-text-main'}`}
      >
        {teaserTitle}
      </h2>
      <div className="space-y-2">
        {preview.map((item) => (
          <details
            key={item.id}
            className={`group rounded-xl border overflow-hidden ${
              darkMode ? 'border-gray-600 bg-gray-900/40' : 'border-gray-200 bg-white'
            }`}
          >
            <summary
              className={`cursor-pointer list-none px-4 py-3 font-semibold text-sm sm:text-base flex justify-between gap-2 items-start [&::-webkit-details-marker]:hidden ${
                darkMode ? 'text-gray-100 hover:bg-gray-800' : 'text-text-main hover:bg-gray-50'
              }`}
            >
              <span>{item.q}</span>
              <span className="text-primary shrink-0 text-lg leading-none opacity-70 group-open:rotate-180 transition-transform">
                ▾
              </span>
            </summary>
            <div
              className={`px-4 pb-3 pt-0 text-sm leading-relaxed border-t ${
                darkMode ? 'text-gray-300 border-gray-700' : 'text-text-secondary border-gray-100'
              }`}
            >
              <p className="pt-3">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenFullFaq}
        className={`mt-6 w-full sm:w-auto px-6 py-3 rounded-xl font-display font-bold text-base border-2 transition-colors ${
          darkMode
            ? 'border-primary/50 text-primary hover:bg-primary/10'
            : 'border-primary/40 text-primary hover:bg-primary/10'
        }`}
      >
        {cta}
      </button>
    </section>
  )
}

export default LandingFaqPreview
