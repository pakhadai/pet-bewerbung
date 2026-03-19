import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  'aria-label'?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 'aria-label': ariaLabel, id, error, ...props }, ref) => (
    <input
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`theme-input smooth-input w-full px-4 py-3 border rounded-xl outline-none text-sm ${
        error ? 'border-red-500 bg-red-50/50 focus:ring-red-300' : 'focus:ring-2 focus:ring-purple-500/20'
      }`}
      style={{
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        ...(error ? { boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)' } : {}),
      }}
      onFocus={(e) => {
        if (!error) {
          e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)';
          e.target.style.borderColor = 'var(--primary)';
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        if (!error) {
          e.target.style.boxShadow = '';
          e.target.style.borderColor = '';
        }
        props.onBlur?.(e);
      }}
      {...props}
    />
  )
);

Input.displayName = 'Input';

export default Input;
