import React from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Button from './Button';

const Navigation = ({ step, onPrev, onNext, onDownloadPDF, showToast, t, canProceed = true, visible = true, darkMode = false }) => {
  if (step === 0 || step === 6) return null;

  const progressStep = step >= 5 ? 4 : Math.min(step, 4);
  const isPreview = step === 5;
  const showDownload = isPreview;

  return (
    <nav className={`nav-panel print:hidden ${visible ? 'nav-visible' : 'nav-hidden'}`} role="navigation" aria-label="Form navigation">
      <Button
        variant="ghost"
        className="btn"
        onClick={onPrev}
        disabled={step === 1}
        title={step === 1 ? '' : (t?.stepsNew?.[`step${step - 1}`]?.title || 'Previous')}
        aria-label={step === 1 ? 'First step' : 'Go to previous step'}
      >
        <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
      </Button>

      <div className="progress-container" role="progressbar" aria-valuenow={progressStep} aria-valuemin={1} aria-valuemax={4} aria-label={`Step ${progressStep} of 4`}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((progressStep - 1) / 3) * 100}%` }} />
        </div>
        <div className="text-xs font-bold theme-text-muted whitespace-nowrap min-w-[48px] text-center" aria-hidden="true">
          {progressStep}/4
        </div>
      </div>

      {showDownload ? (
        <Button variant="primary" className="btn shadow-lg hover:shadow-xl" onClick={onDownloadPDF} title="Download PDF" aria-label="Download document as PDF">
          <Download size={18} aria-hidden="true" />
          <span className="hidden sm:inline ml-2">{t?.labels?.download ?? t?.ui?.download ?? 'Download'}</span>
        </Button>
      ) : (
        <Button
          variant="primary"
          className={`btn shadow-lg hover:shadow-xl ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={canProceed ? onNext : undefined}
          disabled={!canProceed}
          title={!canProceed ? (t?.validation?.fillRequired ?? 'Please fill in required fields') : (t?.stepsNew?.[`step${Math.min(step + 1, 4)}`]?.title ?? 'Next')}
          aria-label={!canProceed ? 'Fill required fields' : 'Go to next step'}
        >
          <span className="hidden sm:inline">{t?.ui?.next ?? 'Next'}</span>
          <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
        </Button>
      )}
    </nav>
  );
};

export default Navigation;
