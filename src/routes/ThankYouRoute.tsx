/**
 * ThankYouRoute Component
 * Thank you page (step 7)
 * Shown after successful submission
 */

import React from 'react';
import { Step6ThankYou } from '../components/steps/index';
import { PetData } from '../types';
import { Toast } from '../hooks/useToast';

interface ThankYouRouteProps {
  data: PetData;
  t: any;
  theme: string;
  onThemeChange: (theme: string) => void;
  onLangChange: (lang: string) => void;
  onLogoClick: () => void;
  onDownloadPDF: () => Promise<void>;
  onCreateAnother: () => void;
  onPrev: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onFaqClick: () => void;
}

export const ThankYouRoute: React.FC<ThankYouRouteProps> = ({
  data,
  t,
  theme,
  onThemeChange,
  onLangChange,
  onLogoClick,
  onDownloadPDF,
  onCreateAnother,
  onPrev,
  showToast,
  onFaqClick,
}) => {
  return (
    <Step6ThankYou
      data={data}
      t={t}
      theme={theme}
      onThemeChange={onThemeChange}
      onLangChange={onLangChange}
      onLogoClick={onLogoClick}
      onDownloadPDF={onDownloadPDF}
      onCreateAnother={onCreateAnother}
      onPrev={onPrev}
      showToast={showToast}
      onFaqClick={onFaqClick}
    />
  );
};

export default ThankYouRoute;
