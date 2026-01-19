import React from 'react';

const Label = ({ children, required }) => (
  <label className="theme-text-muted block text-xs font-bold uppercase tracking-wider mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default Label;
