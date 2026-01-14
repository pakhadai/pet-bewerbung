import React from 'react';

const Footer = ({ step, butterVisible }) => {
  // Only show footer on step 0 (landing) and step 9 (thank you)
  if (step !== 0 && step !== 9) {
    return null;
  }

  return (
    <div className="butter-footer print:hidden">
      <div className={`butter-inner ${butterVisible ? 'visible' : ''}`}>
        <img
          src="https://flagcdn.com/20x15/ch.png"
          alt="CH"
          width="20"
          height="15"
          style={{ display: 'inline-block', marginRight: 8 }}
        />
        St. Gallen — Developed in Switzerland
      </div>
    </div>
  );
};

export default Footer;
