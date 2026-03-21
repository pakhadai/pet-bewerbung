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

import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppProviders from './components/AppProviders';
import AppContent from './components/AppContent';
import RouteLangSync from './components/RouteLangSync';
import RootRedirect from './components/RootRedirect';
import { initUmami } from './utils/umami';

/**
 * App: locale URLs /{de|fr|it|en|rm}/ for SEO + BrowserRouter.
 */
export default function App() {
  useEffect(() => {
    initUmami();
  }, []);

  return (
    <BrowserRouter>
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
  );
}
