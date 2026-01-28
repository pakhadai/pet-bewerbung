import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SwissDocument from '../SwissDocument';
import ErrorBoundary from '../ErrorBoundary';

const Step8Preview = React.memo(({ data, t, animDir, selectedTemplate, darkMode, onPrev, onNext }) => {
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-4xl mx-auto pb-24`}>
      <div className="mb-4 text-center">
        <h2 className={`font-display font-bold text-2xl md:text-3xl ${titleCl}`}>
          {t?.stepsNew?.step5?.title ?? 'Preview'}
        </h2>
        <p className={`font-sans text-sm md:text-base mt-1 ${mutedCl}`}>
          {t?.stepsNew?.step5?.subtitle ?? 'Review template & check your info'}
        </p>
      </div>
      <div className="w-full flex justify-center overflow-auto py-4 mb-4 border-2 rounded-2xl hand-drawn-border theme-bg-secondary theme-border p-4 shadow-lg">
        <div
          id="pdf-document"
          className="overflow-hidden border-2 rounded-lg shadow-2xl theme-card"
          style={{ width: '210mm', height: '292mm', flexShrink: 0 }}
        >
          <ErrorBoundary
            fallbackTitle={t.ui?.previewError || "Document Error"}
            fallbackMessage={t.ui?.previewErrorMessage || "Failed to render the document. Please try selecting a different template or check your data."}
          >
            <SwissDocument data={data} t={t} templateType={selectedTemplate} />
          </ErrorBoundary>
        </div>
      </div>

      {(onPrev != null || onNext != null) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className={`font-display font-bold hand-drawn-button border-2 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                darkMode ? 'border-gray-400 text-gray-200 hover:bg-gray-700' : 'border-gray-500 text-text-main hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
              {t?.nav?.previousStep ?? t?.nav?.back ?? '← Vorheriger Schritt'}
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="font-display font-bold hand-drawn-button border-2 px-6 py-2.5 rounded-xl flex items-center gap-2 border-primary bg-primary text-white hover:bg-primary-dark transition-all ml-auto"
            >
              {t?.nav?.finalReview ?? 'Abschlussprüfung →'}
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
    </div>
  );
});

Step8Preview.displayName = 'Step8Preview';

export default Step8Preview;
