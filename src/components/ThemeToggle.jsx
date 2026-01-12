import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeToggle({ theme, onThemeChange }) {
  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'sepia', icon: Palette, label: 'Sepia' }
  ];

  const currentIndex = themes.findIndex(t => t.id === theme);

  return (
    <div className="relative inline-flex items-center p-1 rounded-xl theme-card theme-border border">
      {/* Animated slider background */}
      <div
        className="absolute inset-1 rounded-lg transition-all duration-300 ease-out"
        style={{
          width: 'calc(33.333% - 0.25rem)',
          transform: `translateX(${currentIndex * 100}%)`,
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : theme === 'sepia'
            ? 'linear-gradient(135deg, #fef5e7 0%, #fef3c7 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />

      {/* Theme buttons */}
      {themes.map((t, index) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className="relative z-10 px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
            title={t.label}
            style={{
              color: isActive
                ? (theme === 'dark' ? '#f1f5f9' : theme === 'sepia' ? '#92400e' : '#4338ca')
                : 'var(--text-muted)'
            }}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
