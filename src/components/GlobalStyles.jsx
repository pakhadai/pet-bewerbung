import React, { useEffect } from 'react';

const GlobalStyles = ({ theme = 'light' }) => {
  useEffect(() => {
    // Динамічно оновлюємо CSS змінні при зміні теми
    const root = document.documentElement;
    const body = document.body;

    const themeVars = {
      light: {
        '--primary': '#4f46e5',
        '--primary-hover': '#4338ca',
        '--primary-light': '#a5b4fc',
        '--bg': '#ffffff',
        '--bg-secondary': '#f9fafb',
        '--text': '#1f2937',
        '--text-secondary': '#374151',
        '--text-muted': '#6b7280',
        '--border': '#e5e7eb',
        '--card-bg': '#ffffff',
        '--card-bg-hover': '#f9fafb',
        '--input-bg': '#f8fafc',
        '--input-border': '#e2e8f0',
        '--shadow': 'rgba(15, 23, 42, 0.08)',
        '--shadow-strong': 'rgba(15, 23, 42, 0.15)',
        '--success': '#10b981',
        '--error': '#ef4444',
        '--warning': '#f59e0b',
        '--button-primary': '#1f2937',
        '--button-primary-hover': '#111827',
        '--button-text': '#ffffff'
      },
      dark: {
        '--primary': '#6366f1',
        '--primary-hover': '#818cf8',
        '--primary-light': '#a5b4fc',
        '--bg': '#0f172a',
        '--bg-secondary': '#1e293b',
        '--text': '#f1f5f9',
        '--text-secondary': '#cbd5e1',
        '--text-muted': '#94a3b8',
        '--border': '#334155',
        '--card-bg': '#1e293b',
        '--card-bg-hover': '#334155',
        '--input-bg': '#1e293b',
        '--input-border': '#475569',
        '--shadow': 'rgba(0, 0, 0, 0.3)',
        '--shadow-strong': 'rgba(0, 0, 0, 0.5)',
        '--success': '#22c55e',
        '--error': '#f87171',
        '--warning': '#fbbf24',
        '--button-primary': '#6366f1',
        '--button-primary-hover': '#818cf8',
        '--button-text': '#ffffff'
      },
      sepia: {
        '--primary': '#b45309',
        '--primary-hover': '#92400e',
        '--primary-light': '#f59e0b',
        '--bg': '#fef3c7',
        '--bg-secondary': '#fef5e7',
        '--text': '#78350f',
        '--text-secondary': '#92400e',
        '--text-muted': '#a16207',
        '--border': '#dda15e',
        '--card-bg': '#fffbeb',
        '--card-bg-hover': '#fef5e7',
        '--input-bg': '#fffbeb',
        '--input-border': '#f59e0b',
        '--shadow': 'rgba(180, 83, 9, 0.15)',
        '--shadow-strong': 'rgba(180, 83, 9, 0.25)',
        '--success': '#16a34a',
        '--error': '#dc2626',
        '--warning': '#ea580c',
        '--button-primary': '#92400e',
        '--button-primary-hover': '#78350f',
        '--button-text': '#ffffff'
      }
    };

    const vars = themeVars[theme] || themeVars.light;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Додаємо data-theme атрибут для додаткового стилювання
    body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --bg: #ffffff;
      --bg-secondary: #f9fafb;
      --text: #1f2937;
      --text-secondary: #374151;
      --text-muted: #6b7280;
      --border: #e5e7eb;
      --card-bg: #ffffff;
      --card-bg-hover: #f9fafb;
      --input-bg: #f8fafc;
      --input-border: #e2e8f0;
      --shadow: rgba(15, 23, 42, 0.08);
      --shadow-strong: rgba(15, 23, 42, 0.15);
    }

    /* Prefer system UI fonts so emoji (flags) use color emoji fonts when available */
    body, select, button, input, textarea {
      font-family: Inter, system-ui, -apple-system, "Segoe UI", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif;
      color: var(--text);
      background: var(--bg);
      transition: background 300ms, color 300ms;
    }

    /* Theme-aware utility classes */
    .theme-text { color: var(--text) !important; }
    .theme-text-secondary { color: var(--text-secondary) !important; }
    .theme-text-muted { color: var(--text-muted) !important; }
    .theme-bg { background-color: var(--bg) !important; }
    .theme-bg-secondary { background-color: var(--bg-secondary) !important; }
    .theme-card { background-color: var(--card-bg) !important; }
    .theme-card-bg-hover { background-color: var(--card-bg-hover) !important; }
    .theme-border { border-color: var(--border) !important; }
    .bg-primary { background-color: var(--primary) !important; }

    /* Special theme classes */
    .theme-step-badge {
      background-color: var(--primary);
      color: var(--button-text);
      opacity: 0.1;
    }
    .theme-step-badge-active {
      background-color: var(--primary);
      color: var(--button-text);
      opacity: 1;
    }
    .theme-success { background-color: var(--success); color: white; }
    .theme-error { background-color: var(--error); color: white; }
    .theme-warning { background-color: var(--warning); color: white; }
    .theme-info-box {
      background-color: var(--bg-secondary);
      color: var(--text);
      border-color: var(--border);
    }
    .theme-radio-selected {
      background-color: var(--button-primary);
      color: var(--button-text);
      border-color: var(--button-primary);
    }
    .theme-radio {
      background-color: var(--card-bg);
      border-color: var(--border);
      color: var(--text);
    }
    .theme-radio:hover {
      background-color: var(--card-bg-hover);
    }

    /* Input theme styles */
    .theme-input {
      background-color: var(--input-bg) !important;
      border-color: var(--input-border) !important;
      color: var(--text) !important;
    }
    .theme-input:hover {
      background-color: var(--card-bg-hover) !important;
    }
    .theme-input:focus {
      border-color: var(--primary) !important;
      background-color: var(--card-bg) !important;
    }

    /* Button theme styles */
    .theme-button-primary {
      background: linear-gradient(135deg, var(--button-primary), var(--button-primary-hover));
      color: var(--button-text);
    }
    .theme-button-primary:hover {
      background: linear-gradient(135deg, var(--button-primary-hover), var(--button-primary));
      box-shadow: 0 20px 25px -5px var(--shadow-strong), 0 8px 10px -6px var(--shadow);
    }
    .theme-button-primary:focus {
      ring-color: var(--button-primary);
    }

    .theme-button-secondary {
      background-color: var(--card-bg);
      color: var(--text);
      border: 2px solid var(--border);
    }
    .theme-button-secondary:hover {
      border-color: var(--primary);
      background-color: var(--card-bg-hover);
    }
    .theme-button-secondary:focus {
      ring-color: var(--primary);
    }

    .theme-button-magic {
      background: linear-gradient(90deg, var(--primary), var(--primary-hover), var(--primary-light));
      color: var(--button-text);
    }
    .theme-button-magic:hover {
      background: linear-gradient(90deg, var(--primary-hover), var(--primary-light), var(--primary));
      box-shadow: 0 20px 25px -5px var(--primary), 0 8px 10px -6px var(--primary);
    }
    .theme-button-magic:focus {
      ring-color: var(--primary);
    }

    .theme-button-ghost {
      background-color: transparent;
      color: var(--text-muted);
    }
    .theme-button-ghost:hover {
      background-color: var(--card-bg-hover);
      color: var(--text);
    }
    .theme-button-ghost:focus {
      ring-color: var(--primary);
    }

    /* Gradient text for hero titles */
    .theme-gradient-text {
      background: linear-gradient(90deg, var(--primary), var(--primary-hover));
      -webkit-background-clip: text;
      background-clip: text;
    }

    /* Basic entrance */
    .fade-enter { opacity: 0; transform: translateY(10px); animation: fadeIn 420ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .stagger-1 { animation-delay: 100ms; }
    .stagger-2 { animation-delay: 200ms; }
    .stagger-3 { animation-delay: 300ms; }
    @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }

    /* Hover glass effect */
    .hover-glass { transition: all 260ms ease; }
    .hover-glass:hover {
      background: var(--card-bg-hover);
      box-shadow: 0 12px 30px -12px var(--shadow-strong);
      transform: translateY(-4px);
    }

    /* Button press */
    .btn-press:active { transform: scale(0.98); }

    /* Header rounded look */
    .app-header {
      background: var(--card-bg) !important;
      border: 1px solid var(--border) !important;
      border-radius: 16px;
      margin: 12px auto;
      max-width: min(1400px, calc(100% - 24px));
      box-shadow: 0 6px 18px var(--shadow);
    }

    /* Bottom nav panel - Modern floating design */
    .nav-panel {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 24px;
      z-index: 60;
      background: var(--card-bg);
      backdrop-filter: blur(20px) saturate(180%);
      border-radius: 24px;
      padding: 12px 16px;
      box-shadow: 0 20px 50px -12px var(--shadow-strong), 0 0 0 1px var(--border);
      border: 1px solid var(--border);
      display: flex;
      gap: 12px;
      align-items: center;
      min-width: 380px;
      animation: navSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-panel:hover {
      box-shadow: 0 24px 60px -12px var(--shadow-strong), 0 0 0 1px var(--primary);
      transform: translateX(-50%) translateY(-2px);
    }
    .nav-panel .btn {
      border-radius: 16px;
      height: 44px;
      min-width: 44px;
      position: relative;
      overflow: hidden;
    }
    .nav-panel .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .nav-panel .btn:hover::before {
      opacity: 1;
    }
    .nav-panel .progress-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
    }
    .nav-panel .progress-bar {
      flex: 1;
      height: 4px;
      background: var(--input-border);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .nav-panel .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--primary-hover));
      border-radius: 999px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      box-shadow: 0 0 12px var(--primary);
    }
    .nav-panel .progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 2s infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes navSlideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    /* Footer butter (made in Switzerland) */
    .butter-footer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display:flex; justify-content:center; pointer-events:none }
    .butter-inner {
      pointer-events:auto;
      transform: translateY(100%);
      transition: transform 420ms cubic-bezier(.2,.9,.3,1);
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-top-left-radius:12px;
      border-top-right-radius:12px;
      padding:8px 16px;
      margin:0 12px 12px;
      box-shadow: 0 10px 30px var(--shadow);
      font-size:13px;
      color: var(--text-muted)
    }
    .butter-inner.visible { transform: translateY(0); }

    /* Page transitions */
    .page { position: relative; will-change: transform, opacity }
    .page-enter-left { animation: pageEnterLeft 420ms cubic-bezier(.2,.9,.3,1) both; }
    .page-enter-right { animation: pageEnterRight 420ms cubic-bezier(.2,.9,.3,1) both; }
    .page-exit { animation: pageExit 320ms cubic-bezier(.2,.9,.3,1) both; }
    @keyframes pageEnterLeft { from { opacity: 0; transform: translateX(18px) scale(.995) } to { opacity:1; transform: translateX(0) scale(1) } }
    @keyframes pageEnterRight { from { opacity: 0; transform: translateX(-18px) scale(.995) } to { opacity:1; transform: translateX(0) scale(1) } }
    @keyframes pageExit { from { opacity:1; transform: translateY(0) } to { opacity:0; transform: translateY(-8px) scale(.998) } }

    /* subtle reveal on scroll for sections */
    .reveal { opacity:0; transform: translateY(12px); transition: opacity 520ms ease, transform 520ms ease }
    .reveal.visible { opacity:1; transform: translateY(0) }

    /* Parallax layers smoothing */
    [data-speed] { will-change: transform; transition: transform 220ms cubic-bezier(.2,.9,.3,1); }
    [data-scroll] { will-change: transform; }

    /* Hero subtitle: keep visual space for exactly three text lines */
    .hero-sub { line-height: 1.5rem; min-height: calc(1.5rem * 3); display: block; }

    /* Additional polish animations */
    .scale-hover {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .scale-hover:hover {
      transform: scale(1.02);
    }

    .pulse-glow {
      animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulseGlow {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 0 0 var(--primary);
      }
      50% {
        opacity: 0.9;
        box-shadow: 0 0 20px 2px var(--primary);
      }
    }

    .bounce-in {
      animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .slide-up-stagger > * {
      opacity: 0;
      transform: translateY(20px);
      animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .slide-up-stagger > *:nth-child(1) { animation-delay: 0.05s; }
    .slide-up-stagger > *:nth-child(2) { animation-delay: 0.1s; }
    .slide-up-stagger > *:nth-child(3) { animation-delay: 0.15s; }
    .slide-up-stagger > *:nth-child(4) { animation-delay: 0.2s; }
    .slide-up-stagger > *:nth-child(5) { animation-delay: 0.25s; }
    .slide-up-stagger > *:nth-child(6) { animation-delay: 0.3s; }
    @keyframes slideUpFade {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .zoom-in {
      animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Smooth theme transition for all elements */
    * {
      transition-property: background-color, border-color, color, fill, stroke;
      transition-duration: 600ms;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    /* Exclude animations and transforms from theme transition */
    *:not(.no-transition) {
      transition-property: background-color, border-color, color, fill, stroke, box-shadow;
      transition-duration: 600ms;
    }

    /* Card hover lift effect */
    .card-lift {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -12px var(--shadow-strong);
    }

    @media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; background: white; } .print\\:hidden { display: none !important; } }
  `}</style>
  );
};

export default GlobalStyles;
