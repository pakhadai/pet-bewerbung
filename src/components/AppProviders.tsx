/**
 * AppProviders Component
 * Wraps the app with all necessary providers and context
 * - Theme management
 * - Error boundary
 * - Global styles
 */

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import GlobalStyles from './GlobalStyles';
import { WizardProviders } from '../context/WizardProviders';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders: Wraps app with providers
 * WizardProviders: split contexts (useFormData, useTranslation etc) for direct use
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <WizardProviders>
        <GlobalStyles />
        {children}
      </WizardProviders>
    </ErrorBoundary>
  );
};

export default AppProviders;
