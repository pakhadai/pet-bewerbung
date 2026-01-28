import React from 'react';

/**
 * 6-step progress bar: 1 Details | 2 Emergency | 3 Pet Description | 4 Upload&Select | 5 Preview | 6 Get PDF.
 * Steps 1–5 show the bar; step 6 (Thank you) is the final screen (no bar).
 */
const StepProgress = ({ step, t, darkMode }) => {
  const steps = [
    { key: 'step1', label: t?.stepsNew?.step1?.title || 'Details', short: '1' },
    { key: 'step2', label: t?.stepsNew?.step2?.title || 'Emergency', short: '2' },
    { key: 'step3', label: t?.stepsNew?.step3?.title || 'Pet Description', short: '3' },
    { key: 'step4', label: t?.stepsNew?.step4?.title || 'Upload & Select', short: '4' },
    { key: 'step5', label: t?.stepsNew?.step5?.title || 'Preview', short: '5' },
    { key: 'step6', label: t?.stepsNew?.step6?.title || t?.stepsNew?.step5?.title || 'Get PDF', short: '6' }
  ];
  const current = step >= 6 ? 6 : Math.min(step, 6);

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-4 py-0 ${darkMode ? 'text-gray-300' : 'text-text-secondary'}`}>
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
