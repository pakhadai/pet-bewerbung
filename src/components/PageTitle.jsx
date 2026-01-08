import React from 'react';

export default function PageTitle({ stepNumber, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">
        {stepNumber}
      </span>
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
      {Icon && <Icon className="ml-auto opacity-30" size={24} />}
    </div>
  );
}
