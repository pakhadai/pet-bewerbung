import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeToggle({ theme, onThemeChange }) {
  const themes = [
    { id: 'light', icon: Sun, label: 'Light', emoji: '☀️' },
    { id: 'dark', icon: Moon, label: 'Dark', emoji: '🌙' },
    { id: 'sepia', icon: Palette, label: 'Sepia', emoji: '🎨' }
  ];

  const currentIndex = themes.findIndex(t => t.id === theme);
  const currentTheme = themes[currentIndex];
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];

  const Icon = currentTheme.icon;

  return (
    <button
      onClick={() => onThemeChange(nextTheme.id)}
      className="relative group px-4 py-2 rounded-xl theme-card theme-border border hover:scale-105 transition-all duration-300 flex items-center gap-2"
      title={`Switch to ${nextTheme.label}`}
      aria-label={`Current theme: ${currentTheme.label}. Click to switch to ${nextTheme.label}`}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      {/* Icon with animation */}
      <div className="relative" aria-hidden="true">
        <Icon
          size={20}
          className="theme-text transition-all duration-300 group-hover:rotate-12"
        />

        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"
          style={{
            background: theme === 'dark'
              ? '#6366f1'
              : theme === 'sepia'
              ? '#f59e0b'
              : '#4f46e5'
          }}
        />
      </div>

      {/* Theme name (hidden on mobile) */}
      <span className="hidden sm:inline theme-text text-sm font-medium">
        {currentTheme.label}
      </span>

      {/* Animated arrow hint */}
      <svg
        className="w-3 h-3 theme-text-muted group-hover:translate-x-0.5 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
