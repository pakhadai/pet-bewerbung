import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PageTitleProps {
  stepNumber: number;
  title: string;
  icon?: LucideIcon;
}

export default function PageTitle({ stepNumber, title, icon: Icon }: PageTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="theme-step-badge-active flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold">
        {stepNumber}
      </span>
      <h2 className="theme-text text-2xl font-bold">{title}</h2>
      {Icon && <Icon className="ml-auto opacity-30" size={24} />}
    </div>
  );
}
