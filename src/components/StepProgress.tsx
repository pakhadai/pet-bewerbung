import React from 'react';

export interface StepProgressProps {
  step: number;
  t: Record<string, unknown>;
  darkMode: boolean;
  onStepClick?: (step: number) => void;
}

const StepProgress: React.FC<StepProgressProps> = ({ step, t, darkMode, onStepClick }) => {
  const steps = [
    { key: 'step1', label: (t?.stepsNew as Record<string, Record<string, string>>)?.step1?.short || 'Daten', short: '1' },
    { key: 'step2', label: (t?.stepsNew as Record<string, Record<string, string>>)?.step2?.short || 'Gesundheit', short: '2' },
    { key: 'step3', label: (t?.stepsNew as Record<string, Record<string, string>>)?.step3?.short || 'Charakter', short: '3' },
    { key: 'step4', label: (t?.stepsNew as Record<string, Record<string, string>>)?.step4?.short || 'Foto', short: '4' },
    { key: 'step5', label: (t?.stepsNew as Record<string, Record<string, string>>)?.step5?.short || 'Design', short: '5' },
    { key: 'step6', label: (t?.stepsNew as Record<string, Record<string, string>>)?.step6?.short || 'Vorschau', short: '6' },
  ];
  const current = step >= 6 ? 6 : Math.min(step, 6);

  const handleStepClick = (targetStep: number) => {
    if (onStepClick && targetStep <= current) {
      onStepClick(targetStep);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-4 py-0 ${darkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        const clickable = idx <= current && !!onStepClick;

        return (
          <React.Fragment key={s.key}>
            <button
              type="button"
              onClick={() => handleStepClick(idx)}
              disabled={!clickable}
              className={`flex items-center gap-2 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
              title={clickable ? `${(t?.ui as Record<string, string>)?.goTo || 'Gehe zu'} ${s.label}` : ''}
            >
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 font-display font-bold text-sm sm:text-base transition-all
                  ${active ? (darkMode ? 'bg-primary border-primary text-white' : 'bg-primary border-primary text-white') : ''}
                  ${done ? (darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-primary/20 border-primary text-primary-dark') : ''}
                  ${!active && !done ? (darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white') : ''}
                  ${clickable ? 'hover:scale-110 hover:shadow-md' : ''}`}
              >
                {done ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : (
                  s.short
                )}
              </div>
              <span className={`hidden sm:inline font-sans text-sm font-semibold transition-colors ${active ? (darkMode ? 'text-white' : 'text-text-main') : ''} ${clickable && !active ? 'hover:text-primary' : ''}`}>
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 sm:w-8 rounded-full transition-colors ${
                  done ? (darkMode ? 'bg-gray-500' : 'bg-primary/40') : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
                aria-hidden
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
