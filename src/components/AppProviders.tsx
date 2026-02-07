/**
 * AppProviders Component
 * Wraps the app with all necessary providers and context
 * - Theme management
 * - Error boundary
 * - Global styles
 */

import React, { ReactNode } from 'react';
import GlobalStyles from './GlobalStyles';
import ErrorBoundary from './ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders: Wraps app with providers
 * Kept minimal - context providers are typically handled at the hook level
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default AppProviders;
