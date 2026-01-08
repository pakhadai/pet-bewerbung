import React from 'react';

const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const base = "inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none active:scale-[0.98] btn-press";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:shadow-2xl",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    magic: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
