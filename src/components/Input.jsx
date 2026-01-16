import React from 'react';

const Input = React.forwardRef(({ 'aria-label': ariaLabel, id, ...props }, ref) => (
  <input
    ref={ref}
    id={id}
    aria-label={ariaLabel}
    className="theme-input w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm transition-all"
    style={{
      focusRingColor: 'var(--primary)'
    }}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
