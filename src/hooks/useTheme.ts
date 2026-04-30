import { useCallback, useEffect, useState } from 'react'

const STORAGE_THEME_KEY = 'pet-bewerbung-theme'

/**
 * Load saved theme from localStorage
 */
const loadSavedTheme = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_THEME_KEY)
    if (saved === 'dark') {
      return true
    } else if (saved === 'light') {
      return false
    }
  } catch (e) {
    // ignore
  }
  // Default to light mode
  return false
}

/**
 * Save theme to localStorage
 */
const saveTheme = (darkMode: boolean): void => {
  try {
    localStorage.setItem(STORAGE_THEME_KEY, darkMode ? 'dark' : 'light')
  } catch (e) {
    console.error('Failed to save theme preference:', e)
  }
}

export interface UseThemeReturn {
  /** Whether dark mode is active */
  darkMode: boolean
  /** Toggle between light and dark mode */
  toggleTheme: () => void
  /** Set dark mode state explicitly */
  setDarkMode: (value: boolean) => void
}

/**
 * Theme management hook
 * Manages light/dark mode preference with localStorage persistence
 *
 * @returns Theme state and handlers
 */
export const useTheme = (): UseThemeReturn => {
  const [darkMode, setDarkModeState] = useState<boolean>(() => loadSavedTheme())

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value)
    saveTheme(value)
  }, [])

  const toggleTheme = useCallback(() => {
    setDarkModeState((prev) => {
      const newValue = !prev
      saveTheme(newValue)
      return newValue
    })
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return {
    darkMode,
    toggleTheme,
    setDarkMode,
  }
}
