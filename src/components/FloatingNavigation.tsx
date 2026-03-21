/**
 * FloatingNavigation.tsx
 *
 * Centralized floating bottom navigation bar with hand-drawn style.
 *
 * Navigation Logic per Step (7 steps total):
 * - Steps 1-5: Back + Next only (data entry, photo, template selection)
 * - Step 6: Back + Finish button (goes to thank-you page)
 * - Step 7: Not shown (thank you page)
 *
 */
import React from 'react';
import MaterialIcon from './MaterialIcon';
import type { TranslationObject } from '../types/template';

export interface FloatingNavigationProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  t?: TranslationObject;
  darkMode?: boolean;
  canProceed?: boolean;
  visible?: boolean;
}

const FloatingNavigation = React.memo<FloatingNavigationProps>(({
  step,
  onPrev,
  onNext,
  t,
  darkMode = false,
  canProceed = true,
  visible = true
}) => {
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

  const navSurface = darkMode
    ? 'bg-gray-900/95 border-gray-600'
    : 'bg-white/95 border-text-main';

  return (
    <div className="fixed bottom-4 sm:bottom-8 inset-x-0 z-40 flex justify-center px-4 pointer-events-none print:hidden">
      <nav
        className={`
          pointer-events-auto flex max-w-full items-center justify-center
          gap-3 sm:gap-12
          px-3 py-2 sm:px-10 sm:py-3
          w-max
          backdrop-blur-md border-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          transition-transform hover:-translate-y-1
          ${navSurface}
        `}
        style={{ borderRadius: '50px 255px 45px 230px / 240px 35px 225px 40px' }}
        role="navigation"
        aria-label="Form navigation"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isBackDisabled}
          className={`group flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg sm:min-h-0 sm:min-w-0 sm:gap-2 sm:text-2xl font-bold transition-colors ${
            isBackDisabled
              ? 'opacity-30 cursor-not-allowed'
              : darkMode
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white active:bg-gray-800'
                : 'text-text-secondary hover:bg-black/5 hover:text-text-main active:bg-black/5'
          }`}
          aria-label={isBackDisabled ? 'First step' : 'Go to previous step'}
        >
          <MaterialIcon
            name="arrow_back"
            className={`text-2xl sm:text-2xl transition-transform ${!isBackDisabled ? 'group-hover:-translate-x-1' : ''}`}
          />
          <span className="hidden sm:inline">{backLabel}</span>
        </button>

        {/* Step 6: Finish Button */}
        {isPreviewStep && (
          <button
            type="button"
            onClick={onNext}
            className={`group flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-3 py-2 font-display text-base sm:min-h-0 sm:px-6 sm:py-2 sm:text-2xl font-bold transition-all hand-drawn-button hover:scale-105 border-2 active:scale-[0.98] ${
              darkMode
                ? 'bg-lavender hover:bg-primary text-primary-dark hover:text-white border-primary/50'
                : 'bg-lavender hover:bg-primary text-primary-dark hover:text-white border-primary/30'
            }`}
            aria-label={nav?.finish ?? ui?.finish ?? 'Finish'}
          >
            <MaterialIcon name="task_alt" className="text-xl sm:text-xl" />
            <span className="hidden sm:inline">{nav?.finish ?? ui?.finish ?? labels?.done ?? 'Finish'}</span>
          </button>
        )}

        {/* Steps 1-5: Next Button */}
        {!isPreviewStep && (
          <button
            type="button"
            onClick={canProceed ? onNext : undefined}
            disabled={!canProceed}
            className={`group flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg sm:min-h-0 sm:min-w-0 sm:gap-2 sm:text-2xl font-bold transition-colors ${
              !canProceed
                ? 'cursor-not-allowed opacity-50 text-gray-400'
                : darkMode
                  ? 'text-white hover:bg-gray-800 hover:text-primary active:bg-gray-800'
                  : 'text-text-main hover:bg-black/5 hover:text-primary active:bg-black/5'
            }`}
            aria-label={!canProceed ? 'Fill required fields' : 'Go to next step'}
          >
            <span className="hidden sm:inline">{nextLabel}</span>
            <MaterialIcon
              name="arrow_forward"
              className={`text-2xl transition-transform ${canProceed ? 'group-hover:translate-x-1' : ''}`}
            />
          </button>
        )}
      </nav>
    </div>
  );
});

FloatingNavigation.displayName = 'FloatingNavigation';

export default FloatingNavigation;
