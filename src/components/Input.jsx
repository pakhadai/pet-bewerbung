import React from 'react';

const Input = React.forwardRef(({ 'aria-label': ariaLabel, id, error, ...props }, ref) => (
  <input
    ref={ref}
    id={id}
    aria-label={ariaLabel}
    className={`theme-input w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm transition-all ${
      error ? 'border-red-500 bg-red-50 focus:ring-red-300' : ''
    }`}
    style={{
      focusRingColor: error ? '#ef4444' : 'var(--primary)'
    }}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
