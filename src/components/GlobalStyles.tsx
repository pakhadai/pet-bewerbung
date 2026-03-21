import React from 'react';

/**
 * GlobalStyles - CSS variables and utility classes
 * Theme switching via .dark class on html (set by AppContainer)
 * No JS theme injection - all variables defined in static CSS
 */
const GlobalStyles: React.FC = () => (
  <style>{`
    /* Self-hosted fonts (privacy by design) */
    /* Self-hosted fonts (privacy by design): loaded from /public/fonts */
    @font-face {
      font-family: 'Amatic SC';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/TUZyzwprpvBS1izr_vO0DQ.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Amatic SC';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/TUZ3zwprpvBS1izr_vOMscG6eQ.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Quicksand';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o18E.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Quicksand';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkM0o18E.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Quicksand';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkCEv18E.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Quicksand';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkBgv18E.ttf') format('truetype');
    }

    /* To use Inter locally, download from https://rsms.me/inter/ and uncomment below: */
    /*
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/Inter-Regular.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/fonts/Inter-Medium.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/Inter-Bold.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 800;
      font-display: swap;
      src: url('/fonts/Inter-ExtraBold.woff2') format('woff2');
    }
    */
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #a5b4fc;
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
      --success: #10b981;
      --error: #ef4444;
      --warning: #f59e0b;
      --button-primary: #1f2937;
      --button-primary-hover: #111827;
      --button-text: #ffffff;
      --header-bg: rgba(255, 255, 255, 0.4);
      --header-border: rgba(229, 231, 235, 0.5);
    }
    html.dark, .dark {
      --primary: #6366f1;
      --primary-hover: #818cf8;
      --primary-light: #a5b4fc;
      --bg: #0f172a;
      --bg-secondary: #1e293b;
      --text: #f1f5f9;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;
      --border: #334155;
      --card-bg: #1e293b;
      --card-bg-hover: #334155;
      --input-bg: #1e293b;
      --input-border: #475569;
      --shadow: rgba(0, 0, 0, 0.3);
      --shadow-strong: rgba(0, 0, 0, 0.5);
      --success: #22c55e;
      --error: #f87171;
      --warning: #fbbf24;
      --button-primary: #6366f1;
      --button-primary-hover: #818cf8;
      --button-text: #ffffff;
      --header-bg: rgba(30, 41, 59, 0.4);
      --header-border: rgba(51, 65, 85, 0.5);
    }

    /* Prefer system UI fonts so emoji (flags) use color emoji fonts when available */
    /* html/body background: gradient from index.html (mint/peach/lavender) - do not override */
    /* Avoid animating text color on large subtrees (better compositing; Lighthouse). */
    html {
      transition: background-color 300ms ease;
    }
    /* Шрифт як на головній: Quicksand (підключено в index.html) */
    body {
      font-family: "Quicksand", system-ui, -apple-system, "Segoe UI", sans-serif;
      color: var(--text);
      transition: background-color 300ms ease;
    }
    select, input, textarea {
      font-family: "Quicksand", system-ui, -apple-system, "Segoe UI", sans-serif;
      color: var(--text);
      background: var(--bg);
      transition: background-color 300ms ease;
    }
    button {
      font-family: "Quicksand", system-ui, -apple-system, "Segoe UI", sans-serif;
      color: var(--text);
      transition: background-color 300ms ease;
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
    .theme-border-card { border-color: var(--card-bg) !important; }
    .bg-primary { background-color: var(--primary) !important; }
    .from-primary { --tw-gradient-from: var(--primary) !important; --tw-gradient-to: rgb(79 70 229 / 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
    .to-primary-hover { --tw-gradient-to: var(--primary-hover) !important; }

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

    /* Basic entrance - 600ms Material-standard for comfortable feel */
    .fade-enter { opacity: 0; transform: translateY(10px); animation: fadeIn 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
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

    /* Header rounded look with transparency */
    .app-header {
      background: var(--header-bg) !important;
      backdrop-filter: blur(16px);
      border: 1px solid var(--header-border) !important;
      border-radius: 16px;
      margin: 12px auto;
      max-width: 80%;
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
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-panel.nav-visible {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateX(-50%) translateY(0) !important;
      pointer-events: auto !important;
      transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), 
                  visibility 400ms cubic-bezier(0.4, 0, 0.2, 1),
                  transform 400ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .nav-panel.nav-hidden {
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateX(-50%) translateY(100px) !important;
      pointer-events: none !important;
      transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), 
                  visibility 400ms cubic-bezier(0.4, 0, 0.2, 1),
                  transform 400ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .nav-panel:hover {
      box-shadow: 0 24px 60px -12px var(--shadow-strong), 0 0 0 1px var(--primary);
    }
    .nav-panel.nav-visible:hover {
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

    /* Page transitions - 600ms Material-standard easing for smoother feel */
    .page { position: relative; will-change: transform, opacity }
    .page-enter-left { animation: pageEnterLeft 600ms cubic-bezier(0.4, 0, 0.2, 1) both; }
    .page-enter-right { animation: pageEnterRight 600ms cubic-bezier(0.4, 0, 0.2, 1) both; }
    .page-exit { animation: pageExit 400ms cubic-bezier(0.4, 0, 0.2, 1) both; }
    @keyframes pageEnterLeft { from { opacity: 0; transform: translateX(12px) scale(.998) } to { opacity:1; transform: translateX(0) scale(1) } }
    @keyframes pageEnterRight { from { opacity: 0; transform: translateX(-12px) scale(.998) } to { opacity:1; transform: translateX(0) scale(1) } }
    @keyframes pageExit { from { opacity:1; transform: translateY(0) } to { opacity:0; transform: translateY(-8px) scale(.998) } }

    /* subtle reveal on scroll for sections - 700ms ease-out for smoother feel */
    .reveal { opacity:0; transform: translateY(12px); transition: opacity 700ms cubic-bezier(0, 0, 0.2, 1), transform 700ms cubic-bezier(0, 0, 0.2, 1) }
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

    /* Blob animation for background */
    @keyframes blob {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(20px, -50px) scale(1.1);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      75% {
        transform: translate(50px, 50px) scale(1.05);
      }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }

    /* Gradient animation */
    @keyframes gradient-x {
      0%, 100% {
        background-size: 200% 200%;
        background-position: left center;
      }
      50% {
        background-size: 200% 200%;
        background-position: right center;
      }
    }
    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
    }

    /* ========================================
       MODERN SMOOTH ANIMATIONS 2024
       ======================================== */
    
    /* Ultra-smooth easing */
    :root {
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
      --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Magnetic hover effect for buttons */
    .magnetic-btn {
      position: relative;
      transition: transform 0.6s var(--ease-out-expo);
    }
    .magnetic-btn:hover {
      transform: scale(1.02);
    }
    .magnetic-btn:active {
      transform: scale(0.98);
      transition-duration: 0.1s;
    }

    /* CTA Button special glow animation */
    .cta-glow {
      position: relative;
      overflow: hidden;
    }
    .cta-glow::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255,255,255,0.4), 
        transparent
      );
      transform: translateX(-100%);
      transition: transform 0.8s var(--ease-out-expo);
    }
    .cta-glow:hover::before {
      transform: translateX(100%);
    }
    .cta-glow::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4);
      transition: box-shadow 0.6s var(--ease-out-expo);
    }
    .cta-glow:hover::after {
      box-shadow: 0 0 40px 8px rgba(168, 85, 247, 0.3);
    }

    /* Float animation */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-slow {
      animation: float 8s ease-in-out infinite;
    }
    .animate-float-delay-1 { animation-delay: 1s; }
    .animate-float-delay-2 { animation-delay: 2s; }

    /* Smooth card interactions */
    .smooth-card {
      transition: 
        transform 0.5s var(--ease-out-expo),
        box-shadow 0.5s var(--ease-out-expo),
        background-color 0.3s ease;
    }
    .smooth-card:hover {
      transform: translateY(-12px) scale(1.01);
      box-shadow: 
        0 32px 64px -16px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    /* Icon bounce on hover */
    .icon-bounce {
      transition: transform 0.5s var(--ease-spring);
    }
    .group:hover .icon-bounce {
      transform: scale(1.15) rotate(5deg);
    }

    /* Text reveal animation */
    @keyframes textReveal {
      0% {
        opacity: 0;
        transform: translateY(30px) skewY(2deg);
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) skewY(0);
        filter: blur(0);
      }
    }
    .text-reveal {
      animation: textReveal 0.8s var(--ease-out-expo) forwards;
    }
    .text-reveal-delay-1 { animation-delay: 0.1s; opacity: 0; }
    .text-reveal-delay-2 { animation-delay: 0.2s; opacity: 0; }
    .text-reveal-delay-3 { animation-delay: 0.3s; opacity: 0; }
    .text-reveal-delay-4 { animation-delay: 0.4s; opacity: 0; }

    /* Stagger children animation */
    .stagger-children > * {
      opacity: 0;
      transform: translateY(24px);
    }
    .stagger-children.animate > * {
      animation: staggerUp 0.6s var(--ease-out-expo) forwards;
    }
    .stagger-children.animate > *:nth-child(1) { animation-delay: 0s; }
    .stagger-children.animate > *:nth-child(2) { animation-delay: 0.08s; }
    .stagger-children.animate > *:nth-child(3) { animation-delay: 0.16s; }
    .stagger-children.animate > *:nth-child(4) { animation-delay: 0.24s; }
    .stagger-children.animate > *:nth-child(5) { animation-delay: 0.32s; }
    .stagger-children.animate > *:nth-child(6) { animation-delay: 0.40s; }
    @keyframes staggerUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Ripple effect */
    .ripple {
      position: relative;
      overflow: hidden;
    }
    .ripple::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), 
        rgba(255,255,255,0.3) 0%, 
        transparent 60%
      );
      opacity: 0;
      transform: scale(0);
      transition: transform 0.6s var(--ease-out-expo), opacity 0.4s ease;
    }
    .ripple:active::after {
      opacity: 1;
      transform: scale(2);
      transition-duration: 0s;
    }

    /* Smooth underline animation */
    .underline-animation {
      position: relative;
    }
    .underline-animation::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--primary-hover));
      border-radius: 2px;
      transition: width 0.4s var(--ease-out-expo);
    }
    .underline-animation:hover::after {
      width: 100%;
    }

    /* Morphing background */
    @keyframes morphBg {
      0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      50% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 50%; }
      75% { border-radius: 60% 40% 60% 30% / 70% 30% 40% 70%; }
    }
    .morph-bg {
      animation: morphBg 8s ease-in-out infinite;
    }

    /* Smooth input focus */
    .smooth-input {
      transition: 
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        background-color 0.3s ease;
    }
    .smooth-input:focus {
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    }

    /* Progress bar smooth fill */
    .progress-smooth {
      transition: width 0.8s var(--ease-out-expo);
    }

    /* Modal/Dialog animations */
    @keyframes modalIn {
      0% {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @keyframes modalOut {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      100% {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
    }
    .modal-enter {
      animation: modalIn 0.4s var(--ease-out-expo) forwards;
    }
    .modal-exit {
      animation: modalOut 0.3s var(--ease-out-expo) forwards;
    }

    /* Backdrop blur animation */
    @keyframes backdropIn {
      from { backdrop-filter: blur(0px); opacity: 0; }
      to { backdrop-filter: blur(8px); opacity: 1; }
    }
    .backdrop-animate {
      animation: backdropIn 0.4s var(--ease-out-expo) forwards;
    }

    /* Tooltip animation */
    .tooltip-animate {
      transform-origin: bottom center;
      animation: tooltipIn 0.3s var(--ease-spring) forwards;
    }
    @keyframes tooltipIn {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(8px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Checkbox/Toggle smooth animation */
    .toggle-smooth {
      transition: 
        background-color 0.3s var(--ease-out-expo),
        transform 0.3s var(--ease-spring);
    }
    .toggle-smooth:active {
      transform: scale(0.95);
    }

    /* List item stagger */
    .list-stagger > * {
      opacity: 0;
      animation: listItemIn 0.4s var(--ease-out-expo) forwards;
    }
    .list-stagger > *:nth-child(1) { animation-delay: 0.02s; }
    .list-stagger > *:nth-child(2) { animation-delay: 0.04s; }
    .list-stagger > *:nth-child(3) { animation-delay: 0.06s; }
    .list-stagger > *:nth-child(4) { animation-delay: 0.08s; }
    .list-stagger > *:nth-child(5) { animation-delay: 0.10s; }
    .list-stagger > *:nth-child(6) { animation-delay: 0.12s; }
    @keyframes listItemIn {
      from {
        opacity: 0;
        transform: translateX(-12px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Skeleton loading animation */
    @keyframes skeletonPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .skeleton {
      animation: skeletonPulse 1.5s ease-in-out infinite;
      background: linear-gradient(90deg, var(--border) 25%, var(--card-bg-hover) 50%, var(--border) 75%);
      background-size: 200% 100%;
    }

    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    @media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; background: white; } .print\\:hidden { display: none !important; } }
  `}</style>
);

export default GlobalStyles;
