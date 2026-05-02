import React from 'react'
import type { Language } from '../hooks/useTranslation'
import type { TranslationObject } from '../types/template'
import FloatingNavigation from './FloatingNavigation'
import Footer from './Footer'
import Header from './Header'
import type { LegalPageType } from './LegalPages'
import MaterialIcon from './MaterialIcon'
import StepProgress from './StepProgress'

export interface WizardShellProps {
  step: number
  animDir: 'left' | 'right'
  darkMode: boolean
  toggleTheme: () => void
  lang: Language
  onLangChange: (lang: Language) => void
  onLogoClick: () => void
  t: TranslationObject

  isStepValid: boolean
  navigationVisible: boolean
  onNavigationVisibilityChange: (visible: boolean) => void
  onPrev: () => void
  onNext: () => void
  onStepClick: (step: number) => void

  onOpenLegal: (page: LegalPageType) => void
  onFaqClick: () => void

  children: React.ReactNode
}

export default function WizardShell({
  step,
  darkMode,
  toggleTheme,
  lang,
  onLangChange,
  onLogoClick,
  t,
  isStepValid,
  navigationVisible,
  onPrev,
  onNext,
  onStepClick,
  onOpenLegal,
  onFaqClick,
  children,
}: WizardShellProps) {
  return (
    <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleTheme}
        lang={lang}
        showSaveStatus={step >= 1 && step <= 6}
        onLangChange={onLangChange}
        onLogoClick={onLogoClick}
        t={t}
      />

      <main
        className={`w-full print:w-full print:max-w-none print:p-0 ${step >= 1 && step <= 6 ? 'pt-[72px]' : ''}`}
        aria-label={t?.ui?.mainLandmark ?? 'Pet application'}
        id="main-content"
      >
        {step >= 1 && step <= 6 && (
          <div className="sticky top-0 z-20 w-full pt-2 print:hidden bg-transparent backdrop-blur-[2px]">
            <StepProgress step={step} t={t} onStepClick={onStepClick} />
            <div className="px-4 md:px-8 pt-1.5 pb-2 flex justify-center print:hidden">
              <div
                className="inline-flex max-w-[min(100%,28rem)] items-center gap-1.5 px-2.5 py-1 rounded-full border text-center text-[11px] sm:text-xs font-semibold leading-tight bg-primary/10 text-[var(--primary)] border-primary/30"
                role="status"
              >
                <MaterialIcon
                  name="shield_lock"
                  className="text-sm shrink-0 text-inherit"
                  aria-hidden
                />
                <span>{t?.hero?.privacyDesc ?? 'Browser only.'}</span>
              </div>
            </div>
          </div>
        )}

        <div
          className={
            step === 0
              ? 'w-full px-4 md:px-8'
              : 'max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0'
          }
        >
          {children}
        </div>
      </main>

      <FloatingNavigation
        step={step}
        onPrev={onPrev}
        onNext={onNext}
        t={t}
        darkMode={darkMode}
        canProceed={isStepValid}
        visible={navigationVisible}
      />

      {step === 0 && <Footer darkMode={darkMode} t={t} onOpenLegal={onOpenLegal} onFaqClick={onFaqClick} />}
    </div>
  )
}

