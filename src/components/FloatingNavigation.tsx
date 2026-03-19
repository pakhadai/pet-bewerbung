/**
 * FloatingNavigation.tsx
 *
 * Centralized floating bottom navigation bar with hand-drawn style.
 *
 * Navigation Logic per Step (7 steps total):
 * - Steps 1-5: Back + Next only (data entry, photo, template selection)
 * - Step 6: Back + Download/Buy Premium button (preview - based on template & premium status)
 * - Step 7: Not shown (thank you page)
 *
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { TranslationObject } from '../types/template';

export interface FloatingNavigationProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  onDownloadPDF: () => void;
  t?: TranslationObject;
  darkMode?: boolean;
  canProceed?: boolean;
  visible?: boolean;
}

const FloatingNavigation = React.memo<FloatingNavigationProps>(({
  step,
  onPrev,
  onNext,
  onDownloadPDF,
  t,
  darkMode = false,
  canProceed = true,
  visible = true
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Don't show navigation on step 0 (landing) or step 7 (thank you)
  if (step === 0 || step === 7) return null;

  // Don't show if explicitly hidden
  if (!visible) return null;

  // Determine what type of navigation to show
  const isPreviewStep = step === 6;

  // Back button label
  const nav = t?.nav;
  const ui = t?.ui;
  const labels = t?.labels;
  const backLabel = nav?.back ?? 'Zurück';
  const nextLabel = nav?.nextStep ?? ui?.next ?? 'Weiter';

  // Determine if back button should be disabled (on step 1)
  const isBackDisabled = step === 1;

  const getStep5ActionConfig = () => ({
    label: labels?.download ?? 'Download PDF',
    icon: 'download',
    handler: onDownloadPDF,
    className: darkMode
      ? 'bg-lavender hover:bg-primary text-primary-dark hover:text-white border-primary/50'
      : 'bg-lavender hover:bg-primary text-primary-dark hover:text-white border-primary/30'
  });

  const handleDownload = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      // `onDownloadPDF` returns Promise<void>, but the prop is typed as () => void in this component.
      await Promise.resolve(onDownloadPDF());
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-0 w-full flex justify-center z-40 pointer-events-none print:hidden">
      <nav
        className={`pointer-events-auto backdrop-blur-md border-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-6 sm:px-10 py-3 flex items-center gap-6 sm:gap-12 transition-transform hover:-translate-y-1 ${
          darkMode
            ? 'bg-gray-900/95 border-gray-600'
            : 'bg-white/95 border-text-main'
        }`}
        style={{ borderRadius: '50px 255px 45px 230px / 240px 35px 225px 40px' }}
        role="navigation"
        aria-label="Form navigation"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isBackDisabled}
          className={`group flex items-center gap-2 font-display text-lg sm:text-2xl font-bold transition-colors ${
            isBackDisabled
              ? 'opacity-30 cursor-not-allowed'
              : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-text-secondary hover:text-text-main'
          }`}
          aria-label={isBackDisabled ? 'First step' : 'Go to previous step'}
        >
          <span className={`material-symbols-outlined text-xl sm:text-2xl transition-transform ${!isBackDisabled ? 'group-hover:-translate-x-1' : ''}`}>
            arrow_back
          </span>
          <span className="hidden sm:inline">{backLabel}</span>
        </button>

        {/* Step 6: Download Button */}
        {isPreviewStep && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={isGeneratingPdf}
            className={`group flex items-center gap-2 px-4 sm:px-6 py-2 font-display text-lg sm:text-2xl font-bold transition-all hand-drawn-button hover:scale-105 border-2 ${getStep5ActionConfig().className} ${
              isGeneratingPdf ? 'opacity-70 cursor-not-allowed hover:scale-100' : ''
            }`}
            aria-label={labels?.download ?? 'Download PDF'}
          >
            <span
              className="material-symbols-outlined text-lg sm:text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isGeneratingPdf ? null : getStep5ActionConfig().icon}
            </span>
            {isGeneratingPdf ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>{getStep5ActionConfig().label}</span>
            )}
          </button>
        )}

        {/* Steps 1-5: Next Button */}
        {!isPreviewStep && (
          <button
            type="button"
            onClick={canProceed ? onNext : undefined}
            disabled={!canProceed}
            className={`group flex items-center gap-2 font-display text-lg sm:text-2xl font-bold transition-colors ${
              !canProceed
                ? 'opacity-50 cursor-not-allowed text-gray-400'
                : darkMode
                  ? 'text-white hover:text-primary'
                  : 'text-text-main hover:text-primary'
            }`}
            aria-label={!canProceed ? 'Fill required fields' : 'Go to next step'}
          >
            <span className="hidden sm:inline">{nextLabel}</span>
            <span className={`material-symbols-outlined text-xl sm:text-2xl transition-transform ${canProceed ? 'group-hover:translate-x-1' : ''}`}>
              arrow_forward
            </span>
          </button>
        )}
      </nav>
    </div>
  );
});

FloatingNavigation.displayName = 'FloatingNavigation';

export default FloatingNavigation;
