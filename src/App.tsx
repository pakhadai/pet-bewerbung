/**
 * App.tsx - Main Application Component
 *
 * Refactored modular structure:
 * - AppProviders: All context providers (theme, translations, premium, toast)
 * - AppContent: Main business logic orchestration
 *
 * This keeps App.tsx clean and focused on composition,
 * while business logic is distributed across focused modules.
 */

import React from 'react';
import AppProviders from './components/AppProviders';
import AppContent from './components/AppContent';

/**
 * App: Main component wrapped in providers
 */
export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
