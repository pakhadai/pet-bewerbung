import React from 'react';
import { ChevronLeft, ChevronRight, Mail, Printer } from 'lucide-react';
import Button from './Button';

const Navigation = ({ step, onPrev, onNext, onDownloadPDF, showToast, t }) => {
  // Don't show navigation on step 0 (landing) or step 9 (thank you)
  if (step === 0 || step === 9) {
    return null;
  }

  return (
    <div className="nav-panel print:hidden">
      <Button
        variant="ghost"
        className="btn"
        onClick={onPrev}
        disabled={step === 1}
        title={t.steps?.[step - 1] || 'Previous'}
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </Button>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step - 1) / 7) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs font-bold theme-text-muted whitespace-nowrap min-w-[60px] text-center">
          {step}/8
        </div>
      </div>

      {step === 8 ? (
        <>
          <Button
            variant="secondary"
            className="btn"
            onClick={() => {
              onDownloadPDF();
              showToast(t.ui.emailComingSoon, 'info');
            }}
            title={t.ui.emailInDevelopment}
          >
            <Mail size={18} />
            <span className="hidden sm:inline ml-2">Email</span>
          </Button>
          <Button
            variant="primary"
            className="btn shadow-lg hover:shadow-xl"
            onClick={onDownloadPDF}
            title="Download PDF"
          >
            <Printer size={18} />
            <span className="hidden sm:inline ml-2">Download</span>
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          className="btn shadow-lg hover:shadow-xl"
          onClick={onNext}
          disabled={step === 8}
          title={t.steps?.[step + 1] || 'Next'}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} strokeWidth={2.5} />
        </Button>
      )}
    </div>
  );
};

export default Navigation;
