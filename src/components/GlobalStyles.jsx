import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    :root { --primary: #4f46e5; --bg: #ffffff; --muted:#6b7280 }

    /* Basic entrance */
    .fade-enter { opacity: 0; transform: translateY(10px); animation: fadeIn 420ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .stagger-1 { animation-delay: 100ms; }
    .stagger-2 { animation-delay: 200ms; }
    .stagger-3 { animation-delay: 300ms; }
    @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }

    /* Hover glass effect */
    .hover-glass { transition: all 260ms ease; }
    .hover-glass:hover { background: rgba(255,255,255,0.95); box-shadow: 0 12px 30px -12px rgba(15,23,42,0.12); transform: translateY(-4px); }

    /* Button press */
    .btn-press:active { transform: scale(0.98); }

    /* Header rounded look */
    .app-header { border-radius: 12px; margin: 12px auto; max-width: calc(100% - 24px); box-shadow: 0 6px 18px rgba(16,24,40,0.06); }

    /* Bottom nav panel */
    .nav-panel { position: fixed; left: 50%; transform: translateX(-50%); bottom: 18px; z-index: 60; background: rgba(255,255,255,0.9); backdrop-filter: blur(6px); border-radius: 999px; padding: 8px; box-shadow: 0 10px 30px rgba(2,6,23,0.08); border: 1px solid rgba(15,23,42,0.06); display:flex; gap:8px; align-items:center }
    .nav-panel .btn { border-radius: 999px }

    /* Footer butter (made in Switzerland) */
    .butter-footer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display:flex; justify-content:center; pointer-events:none }
    .butter-inner { pointer-events:auto; transform: translateY(100%); transition: transform 420ms cubic-bezier(.2,.9,.3,1); background: linear-gradient(90deg,#fafafa,#fff); border-top-left-radius:12px; border-top-right-radius:12px; padding:8px 16px; margin:0 12px 12px; border:1px solid rgba(15,23,42,0.06); box-shadow: 0 10px 30px rgba(2,6,23,0.06); font-size:13px; color:var(--muted) }
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

    @media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; background: white; } .print\\:hidden { display: none !important; } }
  `}</style>
);

export default GlobalStyles;
