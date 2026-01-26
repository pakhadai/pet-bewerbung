import React from 'react';

/**
 * 4-step progress bar: 1 Details | 2 Emergency | 3 Template | 4 Finish.
 * Steps 1–4 map directly; step 5 (Preview) shows 4/4 Finish.
 */
const StepProgress = ({ step, t, darkMode }) => {
  const steps = [
    { key: 'step1', label: t?.stepsNew?.step1?.title || 'Details', short: '1' },
    { key: 'step2', label: t?.stepsNew?.step2?.title || 'Emergency', short: '2' },
    { key: 'step3', label: t?.stepsNew?.step3?.title || 'Template', short: '3' },
    { key: 'step4', label: t?.stepsNew?.step4?.title || 'Finish', short: '4' }
  ];
  const current = step >= 5 ? 4 : Math.min(step, 4);

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-4 py-4 ${darkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        return (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 font-display font-bold text-sm sm:text-base transition-colors
                  ${active ? (darkMode ? 'bg-primary border-primary text-white' : 'bg-primary border-primary text-white') : ''}
                  ${done ? (darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-primary/20 border-primary text-primary-dark') : ''}
                  ${!active && !done ? (darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white') : ''}`}
              >
                {done ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : (
                  s.short
                )}
              </div>
              <span className={`hidden sm:inline font-sans text-sm font-semibold ${active ? (darkMode ? 'text-white' : 'text-text-main') : ''}`}>
                {s.label}
              </span>
            </div>
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
