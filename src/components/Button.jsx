import React from 'react';

const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const base = "inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.96] btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group";

  const styles = {
    primary: "theme-button-primary text-white shadow-lg hover:shadow-xl",
    secondary: "theme-button-secondary shadow-md hover:shadow-lg",
    magic: "theme-button-magic text-white shadow-lg hover:shadow-xl",
    ghost: "theme-button-ghost hover:shadow-md"
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant !== 'ghost' && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
      )}
    </button>
  );
};

export default Button;
