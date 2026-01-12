import React from 'react';

const Input = (props) => (
  <input
    className="theme-input w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm transition-all"
    style={{
      focusRingColor: 'var(--primary)'
    }}
    {...props}
  />
);

export default Input;
