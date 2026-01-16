import React from 'react';
import { LegalFooterLinks } from './LegalPages';

const Footer = ({ step, butterVisible, t, onOpenLegal }) => {
  // Only show footer on step 0 (landing) and step 9 (thank you)
  if (step !== 0 && step !== 9) {
    return null;
  }

  return (
    <div className="butter-footer print:hidden">
      <div className={`butter-inner ${butterVisible ? 'visible' : ''}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center">
            <img
              src="https://flagcdn.com/20x15/ch.png"
              alt="CH"
              width="20"
              height="15"
              style={{ display: 'inline-block', marginRight: 8 }}
            />
            St. Gallen — Developed in Switzerland
          </div>
          <LegalFooterLinks t={t} onOpenLegal={onOpenLegal} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
