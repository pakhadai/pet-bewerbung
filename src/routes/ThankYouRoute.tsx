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
  donationAmount: string;
  setDonationAmount: (amount: string) => void;
  donateOpen: boolean;
  setDonateOpen: (open: boolean) => void;
  paymentOpen: boolean;
  setPaymentOpen: (open: boolean) => void;
  onDonate: (method: string) => Promise<void>;
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
  donationAmount,
  setDonationAmount,
  donateOpen,
  setDonateOpen,
  paymentOpen,
  setPaymentOpen,
  onDonate,
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
      donationAmount={donationAmount}
      setDonationAmount={setDonationAmount}
      donateOpen={donateOpen}
      setDonateOpen={setDonateOpen}
      paymentOpen={paymentOpen}
      setPaymentOpen={setPaymentOpen}
      onDonate={onDonate}
      showToast={showToast}
      onFaqClick={onFaqClick}
    />
  );
};

export default ThankYouRoute;
