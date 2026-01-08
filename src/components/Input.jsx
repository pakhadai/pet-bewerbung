import React from 'react';

const Input = (props) => (
  <input 
    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 text-sm transition-all hover:bg-white"
    {...props}
  />
);

export default Input;
