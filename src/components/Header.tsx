import React, { useEffect, useState } from 'react'
import { PUBLIC_LOGO_HEADER_PATH } from '../constants'
import { type Language, SUPPORTED_LANGS } from '../hooks/useTranslation'
import { isFormStoreSaving } from '../stores/formStore'
import type { TranslationObject } from '../types/template'
import MaterialIcon from './MaterialIcon'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
  lang: Language
  onLangChange: (lang: Language) => void
  onLogoClick: () => void
  t: TranslationObject
  showSaveStatus?: boolean
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  lang,
  onLangChange,
  onLogoClick,
  t,
  showSaveStatus = false,
}) => {
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' },
    { code: 'it', label: 'IT' },
    { code: 'rm', label: 'RM' },
  ]

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!showSaveStatus) return
    let mounted = true
    const tick = () => {
      if (!mounted) return
      setSaving(isFormStoreSaving())
    }
    tick()
    const id = window.setInterval(tick, 400)
    return () => {
      mounted = false
      window.clearInterval(id)
    }
  }, [showSaveStatus])

  return (
    <header className="w-full absolute top-0 z-50 px-4 py-4 lg:px-12 lg:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
          <div
            className={`flex size-10 items-center justify-center hand-drawn-border border-2 border-text-main rotate-[-3deg] transition-transform group-hover:rotate-0 overflow-hidden
            ${darkMode ? 'bg-gray-700' : 'bg-lavender'}`}
          >
            <img
              src={PUBLIC_LOGO_HEADER_PATH}
              alt="pet-bewerbung.ch"
              className="w-full h-full object-contain"
              width={40}
              height={40}
              decoding="async"
            />
          </div>
          <h1
            className={`text-3xl font-bold font-display tracking-wide transition-colors ${darkMode ? 'text-white' : 'text-text-main'}`}
          >
            {t?.header?.title || 'pet-bewerbung.ch'}
          </h1>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          {showSaveStatus && (
            <div
              className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                darkMode
                  ? 'bg-gray-800/70 border-gray-700 text-gray-200'
                  : 'bg-white/70 border-gray-200 text-text-secondary'
              }`}
              role="status"
              aria-live="polite"
            >
              <span
                className={`inline-block size-2 rounded-full ${
                  saving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
                }`}
                aria-hidden
              />
              <span>
                {saving
                  ? (t?.ui?.saving ?? 'Saving…')
                  : (t?.ui?.saved ?? 'Saved')}
              </span>
            </div>
          )}

          {/* Mobile Language Switcher */}
          <div className="md:hidden">
            <label htmlFor="lang-mobile" className="sr-only">
              {t?.header?.language ?? 'Language'}
            </label>
            <select
              id="lang-mobile"
              value={lang}
              onChange={(e) => {
                const v = e.target.value
                if ((SUPPORTED_LANGS as readonly string[]).includes(v)) onLangChange(v as Language)
              }}
              className={`rounded-lg border px-2 py-1 text-sm font-display font-bold ${
                darkMode
                  ? 'bg-gray-800 text-gray-100 border-gray-600'
                  : 'bg-white text-text-main border-gray-300'
              }`}
              aria-label={t?.header?.language ?? 'Language'}
            >
              {languages.map((lng) => (
                <option key={lng.code} value={lng.code}>
                  {lng.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div
            className={`hidden md:flex items-center gap-2 text-lg font-bold font-display ${
              darkMode ? 'text-gray-200' : 'text-text-main'
            }`}
          >
            {languages.map((lng, index) => (
              <React.Fragment key={lng.code}>
                {index > 0 && (
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'} aria-hidden>
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const v = lng.code
                    if ((SUPPORTED_LANGS as readonly string[]).includes(v))
                      onLangChange(v as Language)
                  }}
                  className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
                    lang === lng.code
                      ? darkMode
                        ? 'border-b-2 border-primary text-white'
                        : 'border-b-2 border-primary text-text-main'
                      : darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-text-main'
                  }`}
                >
                  {lng.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Dark Mode Toggle — visible on mobile too (was hidden md:flex) */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className={`flex shrink-0 items-center justify-center p-2 rounded-full transition-colors
               ${darkMode ? 'hover:bg-gray-700 text-amber-200' : 'hover:bg-lavender text-text-main'}`}
          >
            <MaterialIcon name={darkMode ? 'light_mode' : 'dark_mode'} className="text-2xl" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
