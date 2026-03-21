import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { TranslationObject } from '../types/template';

export interface FaqItem {
  id: string;
  category?: string;
  q: string;
  a: string;
}

export interface FaqContentProps {
  t?: TranslationObject;
  darkMode?: boolean;
  className?: string;
}

const FAQ_SUPPORT_EMAIL = 'info@pet-bewerbung.ch';

/**
 * Modular FAQ content: search, category filter, accordion.
 * Can be used inside FaqModal or standalone (e.g. FAQ page).
 */
const FaqContent: React.FC<FaqContentProps> = ({ t, darkMode, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faq = t?.faq;
  const categoriesObj = faq?.categories;
  const categories = [
    { id: 'all', label: categoriesObj?.all || 'All' },
    { id: 'general', label: categoriesObj?.general || 'General' },
    { id: 'privacy', label: categoriesObj?.privacy || 'Privacy' },
    { id: 'cost', label: categoriesObj?.cost || 'Costs' },
    { id: 'tips', label: categoriesObj?.tips || 'Tips' },
  ];

  const questions: FaqItem[] = faq?.items ?? [];

  const filteredQuestions = useMemo(() => {
    return questions.filter(item => {
      const matchesSearch =
        (item.q || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.a || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, questions]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const textMain = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900';

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Search & Filter */}
      <div className={`p-6 pb-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={faq?.searchPlaceholder || 'Suche...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-primary/50 transition-all ${inputBg}`}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-primary text-white border-primary'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-0">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map(item => (
            <div
              key={item.id}
              className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                expandedId === item.id
                  ? darkMode ? 'bg-gray-800/50 border-primary/50' : 'bg-blue-50/50 border-primary/30'
                  : darkMode ? 'bg-transparent border-gray-700 hover:border-gray-600' : 'bg-transparent border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-start justify-between p-4 text-left"
              >
                <span className={`font-bold pr-4 ${expandedId === item.id ? (darkMode ? 'text-primary' : 'text-primary-dark') : textMain}`}>
                  {item.q}
                </span>
                <span className={`mt-1 transition-transform duration-300 flex-shrink-0 ${expandedId === item.id ? 'rotate-180 text-primary' : 'text-gray-400'}`}>
                  <ChevronDown size={20} />
                </span>
              </button>

              <div
                className={`px-4 text-sm leading-relaxed ${textMuted} transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedId === item.id ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {item.a}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-50">
            <Search size={48} className="mx-auto mb-2 opacity-20" />
            <p>{faq?.noResults || 'Keine Ergebnisse'} &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>

      {/* Footer Hint */}
      <div className={`p-4 border-t text-center text-xs flex-shrink-0 ${darkMode ? 'border-gray-800 bg-gray-900 text-gray-500' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
        {(() => {
          const hintText =
            faq?.footerHint ||
            `Questions about the service? Email us at ${FAQ_SUPPORT_EMAIL}`;
          const parts = hintText.split(FAQ_SUPPORT_EMAIL);
          if (parts.length === 2) {
            return (
              <>
                {parts[0]}
                <a
                  href={`mailto:${FAQ_SUPPORT_EMAIL}`}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {FAQ_SUPPORT_EMAIL}
                </a>
                {parts[1]}
              </>
            );
          }
          return hintText;
        })()}
      </div>
    </div>
  );
};

export default FaqContent;
