import React from 'react';
import { Check } from 'lucide-react';

const StatusItem = ({ label, active }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'bg-black border-black text-white' : 'border-gray-300 text-transparent'}`}>
       <Check size={10} strokeWidth={4} />
    </div>
    <span className={`text-xs font-medium uppercase tracking-wide ${active ? 'text-black' : 'text-gray-400'}`}>{label}</span>
  </div>
);

export default StatusItem;
