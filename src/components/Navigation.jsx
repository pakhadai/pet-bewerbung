import React from 'react';
import { ChevronLeft, ChevronRight, Mail, Printer } from 'lucide-react';
import Button from './Button';

const Navigation = ({ step, onPrev, onNext, onDownloadPDF, showToast, t, canProceed = true, visible = true }) => {
  // Don't show navigation on step 0 (landing) or step 9 (thank you)
  if (step === 0 || step === 9) {
    return null;
  }

  return (
    <nav className={`nav-panel print:hidden ${visible ? 'nav-visible' : 'nav-hidden'}`} role="navigation" aria-label="Form navigation">
      <Button
        variant="ghost"
        className="btn"
        onClick={onPrev}
        disabled={step === 1}
        title={t.steps?.[step - 1] || 'Previous'}
        aria-label={`Go to previous step: ${t.steps?.[step - 1] || 'Previous'}`}
      >
        <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
      </Button>

      <div className="progress-container" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={8} aria-label={`Step ${step} of 8`}>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step - 1) / 7) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs font-bold theme-text-muted whitespace-nowrap min-w-[60px] text-center" aria-hidden="true">
          {step}/8
        </div>
      </div>

      {step === 8 ? (
        <Button
          variant="primary"
          className="btn shadow-lg hover:shadow-xl"
          onClick={onDownloadPDF}
          title="Download PDF"
          aria-label="Download document as PDF"
        >
          <Printer size={18} aria-hidden="true" />
          <span className="hidden sm:inline ml-2">Download</span>
        </Button>
      ) : (
        <Button
          variant="primary"
          className={`btn shadow-lg hover:shadow-xl ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={canProceed ? onNext : undefined}
          disabled={!canProceed}
          title={!canProceed ? 'Please fill in required fields' : (t.steps?.[step + 1] || 'Next')}
          aria-label={`Go to next step: ${t.steps?.[step + 1] || 'Next'}`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
        </Button>
      )}
    </nav>
  );
};

export default Navigation;
