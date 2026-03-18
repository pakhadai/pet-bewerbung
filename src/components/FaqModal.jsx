import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import FaqContent from './FaqContent';

/**
 * Modal wrapper for FAQ. Uses modular FaqContent for the answers panel.
 */
const FaqModal = ({ isOpen, onClose, t, darkMode }) => {
  if (!isOpen) return null;

  const cardBg = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const textMain = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 print:hidden"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border ${cardBg} overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary-dark'}`}>
              <HelpCircle size={24} />
            </div>
            <h2 className={`text-xl font-display font-bold ${textMain}`}>
              {t?.faq?.title || 'FAQ'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modular FAQ content */}
        <FaqContent t={t} darkMode={darkMode} className="flex-1 min-h-0 overflow-hidden" />
      </div>
    </div>
  );
};

export default FaqModal;
