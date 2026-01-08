import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    .fade-enter { opacity: 0; transform: translateY(10px); animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .stagger-1 { animation-delay: 100ms; }
    .stagger-2 { animation-delay: 200ms; }
    .stagger-3 { animation-delay: 300ms; }
    @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
    .hover-glass { transition: all 0.3s ease; }
    .hover-glass:hover { background: rgba(255, 255, 255, 0.9); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); transform: translateY(-2px); }
    .btn-press:active { transform: scale(0.98); }
    @media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; background: white; } .print\\:hidden { display: none !important; } }
  `}</style>
);

export default GlobalStyles;
