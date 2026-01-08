import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeToggle({ theme, onThemeChange }) {
  const themes = ['light', 'dark', 'sepia'];
  const icons = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    sepia: <Palette size={18} />
  };
  
  const currentIndex = themes.indexOf(theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  
  return (
    <button
      onClick={() => onThemeChange(nextTheme)}
      title={`Theme: ${theme} (click for ${nextTheme})`}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
      style={{
        background: theme === 'dark' ? '#1e293b' : theme === 'sepia' ? '#fef5e7' : '#f3f4f6',
        color: theme === 'dark' ? '#f1f5f9' : theme === 'sepia' ? '#b45309' : '#4f46e5'
      }}
    >
      {icons[theme]}
    </button>
  );
}
