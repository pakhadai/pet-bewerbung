/**
 * ThankYouRoute Component
 * Thank you page (step 7)
 * Uses WizardContext - no prop drilling
 */

import React from 'react';
import { Step6ThankYou } from '../components/steps/index';

interface ThankYouRouteProps {
  onFaqClick?: () => void;
}

export const ThankYouRoute: React.FC<ThankYouRouteProps> = ({ onFaqClick }) => {
  return <Step6ThankYou onFaqClick={onFaqClick} />;
};

export default ThankYouRoute;
