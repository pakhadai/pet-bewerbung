import React from 'react';

const FLAG_MAP = {
  de: 'de',
  fr: 'fr',
  it: 'it',
  rm: 'ch',
  en: 'gb',
  ua: 'ua'
};

export default function LanguageSelector({ value, onChange }) {
  const langs = [
    { id: 'de', label: 'DE' },
    { id: 'fr', label: 'FR' },
    { id: 'it', label: 'IT' },
    { id: 'rm', label: 'RM' },
    { id: 'en', label: 'EN' },
    { id: 'ua', label: 'UA' },
  ];

  return (
    <div className="language-selector flex items-center gap-2">
      {langs.map(l => (
        <button key={l.id} onClick={() => onChange(l.id)} className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${value === l.id ? 'ring-2 ring-indigo-300' : 'hover:bg-slate-100'}`} aria-pressed={value===l.id}>
          <img src={`https://flagcdn.com/24x18/${FLAG_MAP[l.id]}.png`} alt={`${l.label} flag`} width="24" height="18" style={{ display: 'inline-block' }} />
          <span className="hidden sm:inline text-sm font-medium">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
