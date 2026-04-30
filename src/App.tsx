/**
 * App.tsx - Main Application Component
 *
 * Refactored modular structure:
 * - AppProviders: All context providers (theme, translations, toast)
 * - AppContent: Main business logic orchestration
 *
 * This keeps App.tsx clean and focused on composition,
 * while business logic is distributed across focused modules.
 */

import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppContent from './components/AppContent'
import AppProviders from './components/AppProviders'
import RootRedirect from './components/RootRedirect'
import RouteLangSync from './components/RouteLangSync'
import { initUmami } from './utils/umami'

/**
 * App: locale URLs /{de|fr|it|en|rm}/ for SEO + BrowserRouter.
 */
export default function App() {
  useEffect(() => {
    initUmami()
  }, [])

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/:lang/*"
          element={
            <AppProviders>
              <RouteLangSync />
              <AppContent />
            </AppProviders>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
