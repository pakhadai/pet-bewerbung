import React from 'react';
import { Check } from 'lucide-react';

const StatusItem = ({ label, active }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${active ? 'theme-radio-selected' : 'theme-border bg-transparent text-transparent'}`}>
       <Check size={10} strokeWidth={4} />
    </div>
    <span className={`text-xs font-medium uppercase tracking-wide transition-colors ${active ? 'theme-text' : 'theme-text-muted'}`}>{label}</span>
  </div>
);

export default StatusItem;
