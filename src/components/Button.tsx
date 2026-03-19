import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'magic' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, 'aria-label': ariaLabel, ...props }, ref) => {
    const base = `
    inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
    relative overflow-hidden group
  `;

    const styles: Record<ButtonVariant, string> = {
      primary: 'theme-button-primary text-white shadow-lg',
      secondary: 'theme-button-secondary shadow-md',
      magic: 'theme-button-magic text-white shadow-lg',
      ghost: 'theme-button-ghost',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${styles[variant]} ${className}`}
        aria-label={ariaLabel}
        style={{
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          ...props.style,
        }}
        onMouseEnter={(e) => {
          if (!props.disabled) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow =
              variant !== 'ghost' ? '0 20px 40px -12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)';
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
          props.onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if (!props.disabled) {
            e.currentTarget.style.transform = 'scale(0.97)';
            e.currentTarget.style.transition = 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
          }
          props.onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          props.onMouseUp?.(e);
        }}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {variant !== 'ghost' && (
          <span
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%]"
            style={{ transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
